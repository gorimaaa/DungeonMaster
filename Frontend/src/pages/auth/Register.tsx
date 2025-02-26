import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../../features/auth/authActions";
import { AppDispatch } from "../../store";
import { RegisterInputs } from "../../types/AuthTypes";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterInputs> = (data) => {
    dispatch(registerUser(data));
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.username && <span>Username is required</span>}
          {errors.email && <span>Email is required</span>}
          {errors.password && <span>Password is required</span>}
          {errors.passwordConfirmation && (
            <span>Password confirmation is required</span>
          )}
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              {...register("username", { required: true })}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              {...register("email", { required: true })}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              {...register("password", { required: true })}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              {...register("passwordConfirmation", { required: true })}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
