import { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";



const formSchema = Yup.object().shape({
  fname: Yup.string()
    .required("Ad gerekli.")
    .min(2, "Ad en az 2 karakterli olmalı."),
  lname: Yup.string()
    .required("Soyad gerekli.")
    .min(2, "Soyad en az 2 karakterli olmalı."),
  email: Yup.string()
    .email("E-posta adresi geçersiz.")
    .required("E-posta adresi zorunlu."),
  password: Yup.string()
    .min(6, "Şifre en az 6 karakterden oluşmalı.")
    .required("Şifre zorunlu."),
  terms: Yup.boolean().oneOf([true], "Şartları kabul etmelisiniz.")
});

export default function Form() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    terms: false
  });

  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    terms: ""
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    formSchema.isValid(formData).then((valid) => {
      setFormValid(valid);
    });
  }, [formData]);

  const [formValid, setFormValid] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    const inputValue = type === "checkbox" ? checked : value;

    Yup.reach(formSchema, name)
      .validate(inputValue)
      .then(() =>
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: ""
        }))
      )
      .catch((err) =>
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: err.errors[0]
        }))
      );

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://reqres.in/api/users", formData)
      .then((res) => {
        console.log(res.data);
        setUsers((prevUsers) => [...prevUsers, res.data]);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="App">
      <form method="POST" onSubmit={handleSubmit}>
        <p>
          <label>
            Ad:&nbsp;
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
            />
          </label>
          {errors.fname.length > 0 && (
            <span className="error">
              <br />
              {errors.fname}
            </span>
          )}
        </p>
        <p>
          <label>
            Soyad:&nbsp;
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
            />
          </label>
          {errors.lname.length > 0 && (
            <span className="error">
              <br />
              {errors.lname}
            </span>
          )}
        </p>
        <p>
          <label>
            E-Posta:&nbsp;
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          {errors.email.length > 0 && (
            <span className="error">
              <br />
              {errors.email}
            </span>
          )}
        </p>
        <p>
          <label>
            Şifre:&nbsp;
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          {errors.password.length > 0 && (
            <span className="error">
              <br />
              {errors.password}
            </span>
          )}
        </p>
        <p>
          <label>
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            Şartları kabul ediyorum.
          </label>
          {errors.terms.length > 0 && (
            <span className="error">
              <br />
              {errors.terms}
            </span>
          )}
        </p>
        <p>
          <input type="submit" disabled={!formValid} value="Üye Ol" />
        </p>
      </form>
      {users.length > 0 && (
        <div>
          <h2>Kullanıcılar</h2>
          {users.map((user, index) => (
            <pre key={index}>{JSON.stringify(user, null, 2)}</pre>
          ))}
        </div>
      )}
    </div>
  );
}