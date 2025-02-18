/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/pavill-delete-account", // Nombre del repositorio en GitHub
  images: {
    unoptimized: true,
  },
};

module.exports = {
  basePath: "/pavill-delete-account",
  async rewrites() {
    return [
      {
        source: "/pavill-delete-account/api/eliminar-cliente",
        destination: "http://rtpavillv2.ddns.net:8014/apptaxipavillv3/webservice/JnCliente.php",
      },
    ];
  },
};
