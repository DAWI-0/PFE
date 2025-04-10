import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import image from "../../asset/authBg/foot.jpg"

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
          <div className="relative w-screen h-screen overflow-hidden">
              {/* Background Image */}
              <img
                src={image} // Replace with your background image path
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
              />
        <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] p-8 bg-white rounded-lg shadow-lg text-center space-y-6 z-10">
            <Head title="Confirm Password" />

            <div className="mb-4 text-sm text-black ">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Confirm
                    </PrimaryButton>
                </div>
            </form>
        </div>
        </div>
        </div>
    );
}
