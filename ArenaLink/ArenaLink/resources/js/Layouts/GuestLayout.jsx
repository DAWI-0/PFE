import image from '../asset/authBg/foot.jpg';

const GuestLayout = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        <img
          src={image} // Replace with your background image path
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <main className="relative z-10 w-full h-full flex items-center justify-end p-8">
        {/* Card-like Container */}
        <div className="w-[400px] ">
          {children}
        </div>
      </main>
    </div>
  );
};

export default GuestLayout;