"use client";
import { useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Función para solicitar eliminación
  const handleDeleteRequest = () => {
    if (!validateEmail(email)) {
      Swal.fire({
        title: "Error",
        text: "Por favor ingresa un email válido.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    // Mostrar modal flotante de confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Para confirmar, escribe 'ELIMINAR_CUENTA'",
      input: "text",
      inputPlaceholder: "ELIMINAR_CUENTA",
      showCancelButton: true,
      confirmButtonColor: "#FF6B00",
      cancelButtonColor: "#410099",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (value !== "ELIMINAR_CUENTA") {
          return "Debes escribir exactamente 'ELIMINAR_CUENTA'";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleFinalDelete();
      }
    });
  };

  // Función para eliminar cuenta
  const handleFinalDelete = async () => {
    if (!validateEmail(email)) {
      Swal.fire({
        title: "Error",
        text: "El email no es válido.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    try {
      const apiUrl = `http://rtpavillv2.ddns.net:8014/apptaxipavillv3/webservice/JnCliente.php?Accion=EliminarCliente&ClienteEmail=${encodeURIComponent(email)}&ClienteContrasena=${encodeURIComponent(password)}`;

      const url = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!data.contents) {
        throw new Error("Respuesta vacía del servidor");
      } 
      
      const parsedData = JSON.parse(data.contents); // Convertir a JSON válido

      switch (parsedData.Respuesta) {
        case "E001":
          Swal.fire({
            title: "Cuenta Eliminada",
            text: "Lamentamos tu partida, pero te esperamos de vuelta cuando desees.",
            icon: "success",
            confirmButtonText: "Continuar",
          }).then(() => {
            window.location.href = "https://pavill.com/app";
          });
          break;
        case "E002":
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la cuenta. Inténtalo de nuevo.",
            icon: "error",
            confirmButtonText: "Ok",
          });
          break;
        case "E003":
          Swal.fire({
            title: "Error",
            text: "No encontramos la cuenta en nuestra base de datos.",
            icon: "error",
            confirmButtonText: "Ok",
          });
          break;
        case "E004":
          Swal.fire({
            title: "Error",
            text: "Faltan parámetros. Ingresa email y contraseña.",
            icon: "error",
            confirmButtonText: "Ok",
          });
          break;
        default:
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error desconocido.",
            icon: "error",
            confirmButtonText: "Ok",
          });
      }
    } catch (error) {
      console.log(error); // Para error de ESLink
      Swal.fire({
        title: "Error",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Caja principal */}
      <div className="bg-[#410099] text-white flex flex-col items-center p-8 rounded-xl shadow-lg w-96">
        {/* Logo centrado */}
        <div className="mb-4">
          <Image src="/pavill-delete-account/logo.png" alt="Pavill Logo" width={120} height={120} />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-4">Eliminar Cuenta</h2>

        {/* Input Email */}
        <input
          type="email"
          placeholder="Tu Email"
          className="w-full px-4 py-2 border rounded-lg text-gray-800 mb-3 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Input Contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full px-4 py-2 border rounded-lg text-gray-800 mb-5 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botón Solicitar Eliminación */}
        <button
          className="w-full bg-[#FF6B00] text-white font-semibold py-2 rounded-lg hover:bg-[#e65a00] transition duration-300"
          onClick={handleDeleteRequest}
        >
          Solicitar Eliminación
        </button>
      </div>
    </div>
  );
}
