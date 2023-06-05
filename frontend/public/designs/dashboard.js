function toggle_none() {
  document.querySelector("#user_options_opt").classList.toggle("none");
}
function visible_sidebar() {
  document.querySelector("#sidebar").classList.add("visible");
}
function hide_sidebar() {
  document.querySelector("#sidebar").classList.remove("visible");
}

//change password page
function toggle_passview(target,name) {
  console.log(document.getElementsByName(name));
  const show_cls = "fa-eye";
  const hide_cls = "fa-eye-low-vision";
  if (target.classList.contains(show_cls)) {
    target.classList.remove(show_cls);
    target.classList.add(hide_cls);
    document.getElementsByName(name).type = "text"
  } else if (target.classList.contains(hide_cls)) {
    target.classList.remove(hide_cls);
    target.classList.add(show_cls);
    document.getElementsByName(name).type = "password"

  }
}
