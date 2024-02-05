import jwt_decode from "jwt-decode";
import { SDRoles } from "../Utility/SD";

const withAdminAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const accessToken = localStorage.getItem("token") ?? "";

    if (accessToken) {
      const decode: {
        role: string;
      } = jwt_decode(accessToken);

      if(decode.role !== SDRoles.ADMIN)
      {
        window.location.replace("/accessDenied");
        return null;
      }
    }
    else
    {
        window.location.replace("/login");
        return null;
    }

    return <WrappedComponent {...props}></WrappedComponent>;
  };
};

export default withAdminAuth;
