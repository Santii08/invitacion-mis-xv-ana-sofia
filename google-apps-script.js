/**
 * ==============================================================================
 * CÓDIGO PARA GOOGLE APPS SCRIPT (Google Sheets Privado)
 * MIS XV - ANA SOFÍA
 * ==============================================================================
 * 
 * INSTRUCCIONES PASO A PASO (Solo toma 2 minutos):
 * 
 * 1. Ve a Google Drive (https://drive.google.com) y crea una nueva "Hoja de cálculo de Google".
 *    Nómbrala: "Confirmaciones - Mis XV Ana Sofia".
 * 
 * 2. En la fila 1 de la hoja, escribe los siguientes encabezados en las columnas (A a H):
 *    A: Fecha y Hora
 *    B: Nombre del Invitado
 *    C: ¿Asiste?
 *    D: Cantidad Personas
 *    E: Acompañantes
 *    F: Restricciones Alimentarias
 *    G: Canción Sugerida
 *    H: Mensaje para Ana Sofía
 * 
 * 3. En el menú superior de la hoja de cálculo, haz clic en:
 *    "Extensiones" > "Apps Script".
 * 
 * 4. Borra todo el código que aparezca allí y PEGA TODO ESTE ARCHIVO.
 * 
 * 5. Haz clic en el icono de Guardar (disquete o Ctrl+S).
 * 
 * 6. Haz clic arriba a la derecha en el botón azul "Implementar" (o "Deploy")
 *    > "Nueva implementación" (New deployment).
 * 
 * 7. En el icono de engranaje (Tipo de implementación), selecciona:
 *    "Aplicación web" (Web App).
 * 
 * 8. Configura estos campos:
 *    - Descripción: Recepción RSVP Ana Sofia
 *    - Ejecutar como: "Yo" (tu cuenta de correo de Google)
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone)
 *      (¡OJO! Esto permite que el formulario de la página web pueda guardar las filas, 
 *       pero NADIE puede ver la hoja excepto tú desde tu cuenta privada de Google).
 * 
 * 9. Haz clic en "Implementar", autoriza los permisos con tu cuenta de Google.
 * 
 * 10. Copia la "URL de la aplicación web" (termina en /exec) y pégala en:
 *     js/app.js en la variable GOOGLE_SCRIPT_URL.
 * 
 * ¡Listo! Cada vez que alguien confirme, se añadirá automáticamente a tu hoja privada.
 * ==============================================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si la hoja está vacía, crear encabezados automáticos
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha y Hora",
        "Nombre del Invitado",
        "¿Asiste?",
        "Cantidad Personas",
        "Acompañantes",
        "Restricciones Alimentarias",
        "Canción Sugerida",
        "Mensaje para Ana Sofía"
      ]);
      
      // Dar formato elegante a los encabezados
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground("#5c308c");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    var fechaHora = data.fechaHora || new Date().toLocaleString();
    var nombre = data.nombre || "Anónimo";
    var asiste = data.asiste || "No especificado";
    var personas = data.personas || "0";
    var acompanantes = data.acompanantes || "-";
    var restricciones = data.restricciones || "-";
    var cancion = data.cancion || "-";
    var mensaje = data.mensaje || "-";

    // Agregar la fila con los datos
    sheet.appendRow([
      fechaHora,
      nombre,
      asiste,
      personas,
      acompanantes,
      restricciones,
      cancion,
      mensaje
    ]);

    // Opcional: Si deseas recibir un email cada vez que alguien confirme,
    // descomenta las siguientes 3 líneas:
    // var miEmail = Session.getActiveUser().getEmail();
    // var asunto = "Nueva confirmación para los XV de Ana Sofía: " + nombre + " (" + asiste + ")";
    // MailApp.sendEmail(miEmail, asunto, "Nombre: " + nombre + "\nAsiste: " + asiste + "\nPersonas: " + personas + "\nMensaje: " + mensaje);

    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Confirmación guardada" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("El servicio de confirmación para los XV de Ana Sofía está funcionando correctamente.")
    .setMimeType(ContentService.MimeType.TEXT);
}
