window.onload = function() {
  window.ui = SwaggerUIBundle({
    url: "https://raw.githubusercontent.com/rahulsingh-07/CampusOLX/main/src/main/resources/static/swagger.json",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });
};
