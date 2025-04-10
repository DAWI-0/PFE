import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Log in" />

      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          {status && (
            <div className="mb-4 text-sm font-medium text-green-500">
              {status}
            </div>
          )}

          <form onSubmit={submit}>
            {/* Email Field */}
            <div>
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
                isFocused={true}
                onChange={(e) => setData('email', e.target.value)}
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
                autoComplete="current-password"
                onChange={(e) => setData('password', e.target.value)}
              />

              <InputError message={errors.password} className="mt-2 text-red-500" />
            </div>

            {/* Remember Me */}
            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center">
                <Checkbox
                  name="remember"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="text-blue-700 focus:ring-blue-700"
                />
                <span className="ms-2 text-sm text-black hover:cursor-pointer">
                  Remember me
                </span>
              </label>

              {canResetPassword && (
                <Link
                  href={route('password.request')}
                  className="text-sm text-blue-700 hover:text-blue-900 focus:outline-none focus:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex items-center justify-end">
              <PrimaryButton
                className="w-full justify-center bg-blue-700 hover:bg-blue-900 focus:ring-blue-700"
                disabled={processing}
              >
                {processing ? 'Logging in...' : 'Log in'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
}