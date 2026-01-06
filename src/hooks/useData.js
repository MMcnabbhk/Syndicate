import { useState, useEffect } from 'react';
import { adaptNovelForUI, adaptAudiobookForUI, adaptPoemForUI, adaptShortStoryForUI, adaptAuthorForUI } from '../utils/dataAdapter';

const API_BASE_URL = '/api';

// Generic fetch hook
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError(null);

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (isMounted) {
                    setData(data);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [url]);

    return { data, loading, error };
}

// Novels
export function useNovels() {
    const { data, loading, error } = useFetch(`${API_BASE_URL}/novels`);
    return {
        data: data ? data.map(adaptNovelForUI) : null,
        loading,
        error
    };
}

export function useNovel(id) {
    const { data, loading, error } = useFetch(id ? `${API_BASE_URL}/novels/${id}` : null);
    return {
        data: data ? adaptNovelForUI(data) : null,
        loading,
        error
    };
}

export function useChapters(novelId) {
    const { data, loading, error } = useFetch(novelId ? `${API_BASE_URL}/novels/${novelId}/chapters` : null);
    // Assuming API returns array of chapters
    return {
        data: data ? data.map(c => ({ ...c, sequence: c.chapter_number, content: c.content_html })) : null,
        loading,
        error
    };
}

export function useChapter(novelId, chapterId) {
    // If backend has specific endpoint or we filter from all chapters (depends on API)
    // Assuming generic chapter fetch or filtering
    const { data, loading, error } = useFetch(novelId && chapterId ? `${API_BASE_URL}/novels/${novelId}/chapters/${chapterId}` : null);
    return {
        data: data ? { ...data, sequence: data.chapter_number, content: data.content_html } : null,
        loading,
        error
    };
}

// Audiobooks
export function useAudiobooks() {
    const { data, loading, error } = useFetch(`${API_BASE_URL}/audiobooks`);
    return {
        data: data ? data.map(adaptAudiobookForUI) : null,
        loading,
        error
    };
}

export function useAudiobook(id) {
    return useFetch(id ? `${API_BASE_URL}/audiobooks/${id}` : null);
}

// Poems
export function usePoems() {
    const { data, loading, error } = useFetch(`${API_BASE_URL}/poems`);
    return {
        data: data ? data.map(adaptPoemForUI) : null,
        loading,
        error
    };
}

export function usePoem(id) {
    return useFetch(id ? `${API_BASE_URL}/poems/${id}` : null);
}

// Short Stories
export function useShortStories() {
    const { data, loading, error } = useFetch(`${API_BASE_URL}/short-fiction`);
    return {
        data: data ? data.map(adaptShortStoryForUI) : null,
        loading,
        error
    };
}

export function useShortStory(id) {
    return useFetch(id ? `${API_BASE_URL}/short-fiction/${id}` : null);
}

// Authors
export function useAuthors() {
    const { data, loading, error } = useFetch(`${API_BASE_URL}/authors`);
    return {
        data: data ? data.map(adaptAuthorForUI) : null,
        loading,
        error
    };
}

export function useAuthor(id) {
    const { data, loading, error } = useFetch(id ? `${API_BASE_URL}/authors/${id}` : null);
    return {
        data: data ? adaptAuthorForUI(data) : null,
        loading,
        error
    };
}

export function useAuthorProfile(id) {
    return useFetch(id ? `${API_BASE_URL}/authors/${id}/profile` : null);
}

// Combined data (for pages that need multiple types)
export function useAllContent() {
    const novels = useNovels();
    const audiobooks = useAudiobooks();
    const poems = usePoems();
    const stories = useShortStories();

    const loading = novels.loading || audiobooks.loading || poems.loading || stories.loading;
    const error = novels.error || audiobooks.error || poems.error || stories.error;

    const data = loading ? null : [
        ...(novels.data || []),
        ...(audiobooks.data || []),
        ...(poems.data || []),
        ...(stories.data || [])
    ];

    return { data, loading, error };
}
