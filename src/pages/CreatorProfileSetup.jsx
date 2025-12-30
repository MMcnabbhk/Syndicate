import React, { useState } from 'react';
import { Image, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatorProfileSetup = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [bio, setBio] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [ssn, setSsn] = useState('');
    const [ein, setEin] = useState('');
    const [taxIdType, setTaxIdType] = useState('ssn'); // 'ssn' or 'ein'

    const handleSubmit = () => {
        // Logic to save profile would go here
        const finalTaxId = taxIdType === 'ssn' ? ssn : ein;
        console.log("Saving Creator Profile:", { firstName, lastName, authorName, bio, address: { line1: addressLine1, line2: addressLine2, city, state, zip, country }, birthdate, taxId: finalTaxId, taxIdType });
        navigate('/syndicate-work'); // Redirect to next step
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white flex justify-center py-10 px-4">
            <div className="w-full max-w-[680px]">

                <div className="h-[40px]"></div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Creator Profile</span>
                    </h1>
                    <p className="text-zinc-400">Tell us a bit about yourself and your work.</p>
                    <div className="h-[60px]"></div>
                </div>

                <div className="flex flex-col">

                    {/* Names */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 std-form-group">
                        <div>
                            <label className="std-label">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="std-input"
                                placeholder="Isabella"
                            />
                        </div>
                        <div>
                            <label className="std-label">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="std-input"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    {/* Author Name */}
                    <div className="std-form-group">
                        <label className="std-label">Author Name (Pen Name)</label>
                        <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="std-input"
                            placeholder="J.D. Writer"
                        />
                    </div>

                    {/* Birthdate */}
                    <div className="std-form-group">
                        <label className="std-label">Birthdate</label>
                        <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            className={`std-input scheme-dark ${birthdate ? 'text-white' : 'text-zinc-500'}`}
                        />
                    </div>

                    {/* Bio Field */}
                    <div className="std-form-group">
                        <label className="std-label">Biography</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="std-input resize-none leading-relaxed"
                            placeholder="Share your story..."
                        />
                    </div>

                    <div className="h-[50px]"></div>

                    {/* Address Block */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">Address Information</h3>
                        <p className="text-zinc-500 text-sm mb-10">Required to receive payments for your work.</p>
                        <div className="h-[10px]"></div>
                        <div className="flex flex-col">
                            <div className="std-form-group">
                                <label className="std-label">Address Line 1</label>
                                <input
                                    type="text"
                                    value={addressLine1}
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                    className="std-input"
                                    placeholder="Street address, P.O. box, etc."
                                />
                            </div>
                            <div className="std-form-group">
                                <label className="std-label">Address Line 2</label>
                                <input
                                    type="text"
                                    value={addressLine2}
                                    onChange={(e) => setAddressLine2(e.target.value)}
                                    className="std-input"
                                    placeholder="Apartment, suite, unit, etc. (Optional)"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6 std-form-group">
                                <div>
                                    <label className="std-label">City</label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="std-input"
                                    />
                                </div>
                                <div>
                                    <label className="std-label">State / Province</label>
                                    <input
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className="std-input"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6 std-form-group">
                                <div>
                                    <label className="std-label">Zip / Postal Code</label>
                                    <input
                                        type="text"
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                        className="std-input"
                                    />
                                </div>
                                <div>
                                    <label className="std-label">Country</label>
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="std-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-[50px]"></div>

                    <hr className="border-zinc-800" />

                    <div className="h-[50px]"></div>

                    {/* Payment / Tax Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-white">Payment Information</h3>
                        <p className="text-zinc-500 text-sm mb-10">Required to receive payments for your work.</p>

                        <div className="h-[10px]"></div>

                        <div className="flex flex-col">
                            <div className="std-form-group">
                                <label className="std-label mb-6">Tax ID Type</label>
                                <div className="h-[20px]"></div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="taxIdType"
                                        value="ssn"
                                        checked={taxIdType === 'ssn'}
                                        onChange={() => setTaxIdType('ssn')}
                                        className="text-violet-500 focus:ring-violet-500 bg-[#1A1A1A] border-zinc-600"
                                    />
                                    <span className="text-white text-sm">Social Security Number (SSN)</span>
                                </label>
                                <div className="ml-6 mt-2">
                                    <input
                                        type="text"
                                        value={ssn}
                                        onChange={(e) => setSsn(e.target.value)}
                                        onFocus={() => setTaxIdType('ssn')}
                                        className="std-input"
                                        placeholder="xxx-xx-xxxx"
                                    />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer mt-4">
                                    <input
                                        type="radio"
                                        name="taxIdType"
                                        value="ein"
                                        checked={taxIdType === 'ein'}
                                        onChange={() => setTaxIdType('ein')}
                                        className="text-violet-500 focus:ring-violet-500 bg-[#1A1A1A] border-zinc-600"
                                    />
                                    <span className="text-white text-sm">Tax ID (EIN)</span>
                                </label>
                                <div className="ml-6 mt-2">
                                    <input
                                        type="text"
                                        value={ein}
                                        onChange={(e) => setEin(e.target.value)}
                                        onFocus={() => setTaxIdType('ein')}
                                        className="std-input"
                                        placeholder="xx-xxxxxxx"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-[50px]"></div>

                    <hr className="border-zinc-800" />

                    <div className="h-[50px]"></div>

                    {/* Action Bar */}
                    <div className="pt-4 flex justify-center">
                        <button
                            onClick={handleSubmit}
                            className="bg-transparent border border-[#cc5500] text-[#cc5500] hover:bg-[#cc5500] hover:text-white font-semibold py-3 px-10 rounded-lg transition-colors"
                        >
                            Complete Setup
                        </button>
                    </div>

                    <div className="h-[90px]"></div>

                </div>
            </div>
        </div>



    );
};

export default CreatorProfileSetup;
