import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Register" />

      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-black mb-6">
            Create an Account
          </h1>

          <form onSubmit={submit}>
            {/* Name Field */}
            <div>
              <InputLabel htmlFor="name" value="Name" className="text-sm text-black"/>

              <TextInput id="name" name="name" value={data.name} className="mt-1 block w-full bg-white text-black border-gray-300 focus:border-blue-700 focus:ring-blue-700 rounded-md shadow-sm" autoComplete="name" isFocused={true} onChange={(e) => setData('name', e.target.value)} required
              />

              <InputError message={errors.name} className="mt-2 text-red-500" />
            </div>

            {/* Email Field */}
            <div className="mt-4">
              <InputLabel
                htmlFor="email"
                value="Email"
                className="text-sm text-black"
              />

              <TextInput
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full bg-white text-black border-gray-300 focus:border-blue-700 focus:ring-blue-700 rounded-md shadow-sm"
                autoComplete="username"
                onChange={(e) => setData('email', e.target.value)}
                required
              />

              <InputError message={errors.email} className="mt-2 text-red-500" />
            </div>

            {/* Password Field */}
            <div className="mt-4">
              <InputLabel
                htmlFor="password"
                value="Password"
                className="text-sm text-black"
              />

              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full bg-white text-black border-gray-300 focus:border-blue-700 focus:ring-blue-700 rounded-md shadow-sm"
                autoComplete="new-password"
                onChange={(e) => setData('password', e.target.value)}
                required
              />

              <InputError message={errors.password} className="mt-2 text-red-500" />
            </div>

            {/* Confirm Password Field */}
            <div className="mt-4">
              <InputLabel
                htmlFor="password_confirmation"
                value="Confirm Password"
                className="text-sm text-black"
              />

              <TextInput
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                className="mt-1 block w-full bg-white text-black border-gray-300 focus:border-blue-700 focus:ring-blue-700 rounded-md shadow-sm"
                autoComplete="new-password"
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required
              />

              <InputError message={errors.password_confirmation} className="mt-2 text-red-500" />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <Link
                href={route('login')}
                className="text-sm text-blue-700 hover:text-blue-900 focus:outline-none focus:underline"
              >
                Already registered?
              </Link>

              <PrimaryButton
                className="ms-4 bg-blue-800 hover:bg-blue-800 focus:ring-blue-800"
                disabled={processing}
              >
                {processing ? 'Registering...' : 'Register'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
}