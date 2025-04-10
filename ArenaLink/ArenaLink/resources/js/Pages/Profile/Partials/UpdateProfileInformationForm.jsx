import React, { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Facebook, Twitter, Linkedin, Instagram, PenLine, Upload } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    // État du formulaire avec seulement name et email requis
    const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '', // Optional field
        bio: user.bio || '', // Optional field
        country: user.country || '', // Optional field
        cityState: user.city_state || '', // Optional field
        postalCode: user.postal_code || '', // Optional field
        facebook: user.facebook || '', // Optional field
        instagram: user.instagram || '', // Optional field
        linkedin: user.linkedin || '', // Optional field
        twitter: user.twitter || '', // Optional field
        profile_image: user.profile_image || null, // Profile image file
    });

    const [profileImage, setProfileImage] = useState(user.profile_image || null);
    const [isEditing, setIsEditing] = useState(false); // Mode édition

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            setData('profile_image', file);
        }
        setIsEditing(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (data.profile_image instanceof File) {
            const formData = new FormData();
            
            // Add all the form fields to FormData
            Object.keys(data).forEach(key => {
                if (key === 'profile_image' && data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });
            
            // Use Inertia's post method with FormData
            patch(route('profile.update'), formData, {
                forceFormData: true,
            });
        } else {
            // Regular form submission without files
            patch(route('profile.update'));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* En-tête du profil */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-0">
                        <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-blue-600 overflow-hidden">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                                    <Upload className="w-6 h-6 text-white" />
                                    <form action={route('profile.update')} encType='multipart/form-data'>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    </form>
                                </label>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl font-semibold text-gray-900">{data.name}</h1>
                                <div className="flex flex-col md:flex-row items-center gap-2 text-gray-600 mt-1">
                                    <span>{data.email}</span>
                                    <span className="hidden md:inline text-gray-300">|</span>
                                    <span>{data.phone || 'Pas de numéro de téléphone'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-end items-center gap-3">
                            {/* Icônes des réseaux sociaux */}
                            {data.facebook && (
                                <a
                                    href={data.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <Facebook className="w-5 h-5 text-gray-600" />
                                </a>
                            )}
                            {data.instagram && (
                                <a
                                    href={data.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <Instagram className="w-5 h-5 text-gray-600" />
                                </a>
                            )}
                            {data.linkedin && (
                                <a
                                    href={data.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <Linkedin className="w-5 h-5 text-gray-600" />
                                </a>
                            )}
                            {data.twitter && (
                                <a
                                    href={data.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <Twitter className="w-5 h-5 text-gray-600" />
                                </a>
                            )}

                            {/* Bouton Modifier */}
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                <PenLine className="w-4 h-4" />
                                <span>Modifier</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    {isEditing ? (
                        <form onSubmit={submit} className="space-y-6">
                            {/* Nom */}
                            <div>
                                <InputLabel htmlFor="name" value="Nom" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel htmlFor="email" value="Adresse email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {/* Téléphone (optionnel) */}
                            <div>
                                <InputLabel htmlFor="phone" value="Téléphone" />
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    className="mt-1 block w-full"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    autoComplete="tel"
                                />
                                <InputError className="mt-2" message={errors.phone} />
                            </div>

                            {/* Bio (optionnel) */}
                            <div>
                                <InputLabel htmlFor="bio" value="Bio" />
                                <textarea
                                    id="bio"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    rows="3"
                                />
                                <InputError className="mt-2" message={errors.bio} />
                            </div>

                            {/* Pays (optionnel) */}
                            <div>
                                <InputLabel htmlFor="country" value="Pays" />
                                <TextInput
                                    id="country"
                                    className="mt-1 block w-full"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    autoComplete="country"
                                />
                                <InputError className="mt-2" message={errors.country} />
                            </div>

                            {/* Ville/État (optionnel) */}
                            <div>
                                <InputLabel htmlFor="cityState" value="Ville/État" />
                                <TextInput
                                    id="cityState"
                                    className="mt-1 block w-full"
                                    value={data.cityState}
                                    onChange={(e) => setData('cityState', e.target.value)}
                                    autoComplete="address-level2"
                                />
                                <InputError className="mt-2" message={errors.cityState} />
                            </div>

                            {/* Code postal (optionnel) */}
                            <div>
                                <InputLabel htmlFor="postalCode" value="Code postal" />
                                <TextInput
                                    id="postalCode"
                                    className="mt-1 block w-full"
                                    value={data.postalCode}
                                    onChange={(e) => setData('postalCode', e.target.value)}
                                    autoComplete="postal-code"
                                />
                                <InputError className="mt-2" message={errors.postalCode} />
                            </div>

                            {/* Liens des réseaux sociaux (optionnels) */}
                            <div>
                                <InputLabel htmlFor="facebook" value="Lien Facebook" />
                                <TextInput
                                    id="facebook"
                                    className="mt-1 block w-full"
                                    value={data.facebook}
                                    onChange={(e) => setData('facebook', e.target.value)}
                                    autoComplete="url"
                                />
                                <InputError className="mt-2" message={errors.facebook} />
                            </div>

                            <div>
                                <InputLabel htmlFor="instagram" value="Lien Instagram" />
                                <TextInput
                                    id="instagram"
                                    className="mt-1 block w-full"
                                    value={data.instagram}
                                    onChange={(e) => setData('instagram', e.target.value)}
                                    autoComplete="url"
                                />
                                <InputError className="mt-2" message={errors.instagram} />
                            </div>

                            <div>
                                <InputLabel htmlFor="linkedin" value="Lien LinkedIn" />
                                <TextInput
                                    id="linkedin"
                                    className="mt-1 block w-full"
                                    value={data.linkedin}
                                    onChange={(e) => setData('linkedin', e.target.value)}
                                    autoComplete="url"
                                />
                                <InputError className="mt-2" message={errors.linkedin} />
                            </div>

                            <div>
                                <InputLabel htmlFor="twitter" value="Lien Twitter" />
                                <TextInput
                                    id="twitter"
                                    className="mt-1 block w-full"
                                    value={data.twitter}
                                    onChange={(e) => setData('twitter', e.target.value)}
                                    autoComplete="url"
                                />
                                <InputError className="mt-2" message={errors.twitter} />
                            </div>

                            {/* Bouton Sauvegarder */}
                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'En cours...' : 'Sauvegarder'}
                                </PrimaryButton>
                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-gray-600">Sauvegardé.</p>
                                </Transition>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-500">Nom</p>
                                <p className="mt-1 text-gray-900">{data.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Adresse email</p>
                                <p className="mt-1 text-gray-900">{data.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Téléphone</p>
                                <p className="mt-1 text-gray-900">{data.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Bio</p>
                                <p className="mt-1 text-gray-900">{data.bio || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pays</p>
                                <p className="mt-1 text-gray-900">{data.country || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ville/État</p>
                                <p className="mt-1 text-gray-900">{data.cityState || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Code postal</p>
                                <p className="mt-1 text-gray-900">{data.postalCode || '-'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}