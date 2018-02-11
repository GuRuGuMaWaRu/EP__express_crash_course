$(document).ready(function() {
  $(".delete-user").on("click", deleteUser);
});

function deleteUser() {
  var confirmation = confirm("Are you sure?");
  if (confirmation) {
    $.ajax({
      type: "DELETE",
      url: "/users/delete/" + $(this).data("id")
    }).done(function(res) {
      window.location.replace("/");
    });
    window.location.replace("/");
  } else {
    return false;
  }
}
