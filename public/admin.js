document.addEventListener("DOMContentLoaded", function () {
  ClassicEditor
      .create(document.querySelector("#email_content"), {
          toolbar: [
              'heading', '|', 'bold', 'italic', 'underline', 'link', '|',
              'bulletedList', 'numberedList', 'blockQuote', '|',
              'undo', 'redo', 'alignment', '|', 'fontSize', 'fontColor', 'fontBackgroundColor',
              'insertTable', 'mediaEmbed', 'imageUpload'
          ]
      })
      .catch(error => console.error(error));

  document.querySelector("#send-email-form").addEventListener("submit", function (event) {
      const editorContent = document.querySelector("#email_content").value;
      if (editorContent.trim() === "") {
          event.preventDefault();
          alert("Email content cannot be empty!");
      }
  });
});

function logout() {
  window.location.href = "/auth/logout";
}
