import PrimaryButton from '@/Components/PrimaryButton';
import image from "../../asset/authBg/foot.jpg";
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
  const { post, processing } = useForm({});

  const submit = (e) => {
    e.preventDefault();
    post(route('verification.send'));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={image} // Replace with your background image path
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Centered Form Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] p-8 bg-white rounded-lg shadow-lg text-center space-y-6 z-10">
          {/* Head Title */}
          <Head title="Email Verification" />

          {/* Instruction Text */}
          <div className="text-sm text-gray-700">
            Thanks for signing up! Before getting started, could you verify your
            email address by clicking on the link we just emailed to you? If you
            didn't receive the email, we will gladly send you another.
          </div>

          {/* Success Message */}
          {status === 'verification-link-sent' && (
            <div className="text-sm font-medium text-green-600">
              A new verification link has been sent to the email address you
              provided during registration.
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            {/* Resend Verification Email Button */}
            <PrimaryButton
              className="w-full justify-center bg-blue-700 hover:bg-blue-900 focus:ring-indigo-500"
              disabled={processing}
            >
              {processing ? 'Sending...' : 'Resend Verification Email'}
            </PrimaryButton>

            {/* Log Out Link */}
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="block text-sm text-blue-700 underline hover:text-blue-900 focus:outline-none focus:underline"
            >
              Log Out
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}