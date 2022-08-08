document.querySelector(".edit a").addEventListener("click", function (e) {
  e.preventDefault();

  profileModal();
});

function profileModal() {
  const modalExists = document.querySelector(".modal");
  modalExists ? modalExists.classList.add("show") : createModal();
}

function createModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal", "show");

  const cell = document.createElement("div");
  cell.classList.add("cell");

  const h2 = document.createElement("h2");
  h2.innerHTML = "Enter new name.";

  const input = document.createElement("input");
  input.id = "new-name";
  input.type = "text";
  input.placeholder = "New Name";

  const row = document.createElement("div");
  row.classList.add("row");

  const submit = document.createElement("input");
  submit.id = "submit";
  submit.type = "submit";
  submit.innerHTML = "Change";

  submit.setAttribute("onclick", "changeName(event)");

  const cancel = document.createElement("button");
  cancel.id = "cancel";
  cancel.innerHTML = "Cancel";

  cancel.setAttribute("onclick", "hideModal()");

  modal.appendChild(cell);
  cell.appendChild(h2);
  cell.appendChild(input);
  row.appendChild(submit);
  row.appendChild(cancel);
  cell.appendChild(row);

  document.body.prepend(modal);
}

function changeName(e) {
  const modal = document.querySelector(".modal.show");
  const newName = document.getElementById("new-name");
  const oldName = document.querySelector(".profile h2");

  newName.value.length > 0
    ? ((oldName.innerHTML = newName.value),
      modal.classList.remove("show"),
      (newName.value = ""))
    : alert("No name given");
}

function hideModal(e) {
  const newName = document.getElementById("new-name");

  newName.value.length > 0 ? (newName.value = "") : null;

  document.querySelector(".modal").classList.remove("show");
}

const requests = document.querySelectorAll(".choice i");

for (request of requests) {
  request.addEventListener("click", function (e) {
    const option = e.target;
    const user = option.parentNode.dataset.user;
    const choice = option.classList.contains("fa-check-circle") ? true : false;
    const target = document.querySelector("ul[data-user=" + user + "]");

    const connections = document.querySelector(".connections .header p");
    const cNum = parseInt(connections.innerHTML);

    const requests = document.querySelector(".requests .header p");
    const rNum = parseInt(requests.innerHTML);

    console.log(requests);

    //always remove target
    target.remove();

    //always reduce requests
    requests.innerHTML = rNum - 1;

    choice ? (connections.innerHTML = cNum + 1) : null;
  });
}
