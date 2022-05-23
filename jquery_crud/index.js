var PAGE_TITLE = "List Studients";
var MESSAGE_SELECT_STUDIENT = "Select at least one studient!";
var MODAL_TITLE_CREATE = "Create New Studient";
var MODAL_TITLE_UPDATE = "Update Studient";

var studients = [
  { id: 1, code: "01", fullName: "Nguyễn Văn A", sex: "Male", birthDate: "1993-11-21", address: "34, Ngô Quyền", phone: "0954587435", department: "IT", majorObject: "Software engenerring" },
  { id: 2, code: "02", fullName: "Bùi Đình Tạ", sex: "Male", birthDate: "1994-09-09", address: "35, Lê Quý Đôn", phone: "0954556705", department: "Chemistry", majorObject: "Inorganic chemistry" },
  { id: 3, code: "03", fullName: "Tạ Thị Vân Anh", sex: "Female", birthDate: "1998-05-13", address: "56 Lê Đại Hành", phone: "0959586735", department: "Physical", majorObject: "Quantum mechanics" }
]

var elements = {
  pageTitleElement: ".page-title",
  buttonAddNewStudient: "#btn_add",
  buttonDeleteListStudient: "#btn_delete_list",
  buttonDeleteStudient: "#tbl_studients .btn-delete-studient",
  buttonUpdateStudient: "#tbl_studients .btn-update-studient",
  tableStudients: "#tbl_studients",
  tableStudients: "#tbl_studients",
  tableBodyStudients: "#tbl_studients tbody",
  buttonCheckAll: "#tbl_studients #check_all",
  modalStudient: "#modal_studient",
  modalStudientTitle: "#modal_studient .modal-title",
  formStudient: "#form_studient",
  inputDepartment: "#form_studient #input_department",
  inputMajorObject: "#form_studient #input_major_object",
  buttonSubmitFormStudient: "#submit_form_studient",
  labelError: "label.error",
};

var commons = {
  formDataToJson: function(form) {
    let arrayData = form.serializeArray();
    let dataJson = {};
    $.map(arrayData, function(item){
      dataJson[item['name']] = item['value'];
    });
    return dataJson;
  },

  checkAllCheckBoxOfTable: function(checkAllCheckBox) {
    let table = checkAllCheckBox.parents().find("table").first();
    let checkBoxes = table.find("tbody :checkbox");
    checkBoxes.prop("checked", checkAllCheckBox.is(':checked'));
    return checkBoxes;
  },

  getCheckedBoxOfTable: function(table) {
    let checkBoxes = table.find("tbody :checkbox:checked");
    return checkBoxes;
  },

  populateFormData: function (form, data) {   
    $.each(data, function(key, value) {  
        let ctrl = $('[name='+key+']', form);  
        switch(ctrl.prop("type")) { 
            case "radio": case "checkbox":   
                ctrl.each(function() {
                    if($(this).attr('value') == value) $(this).attr("checked",value);
                });   
                break;  
            default:
                ctrl.val(value); 
        }  
    });  
  }

} 

var events = {

  init: function () {
	this.setPageTitle(PAGE_TITLE)
    this.renderListStudient(studients);
    this.openModalAddStudient();
    this.submitFormStudient();
    this.checkAllStudient();
    this.deleteListStudient();
    this.deleteOneStudient();
    this.openModalUpdateStudient();
    this.changeMajorObjectByDepartment();
  },
  
  setPageTitle: function (title) {
	  $(elements.pageTitleElement).text(title);
  },

  openModalAddStudient: function () {
    $(elements.buttonAddNewStudient).on("click", function () {
      $(elements.modalStudientTitle).text(MODAL_TITLE_CREATE);
      $(elements.buttonSubmitFormStudient).text("Create")
      $(elements.formStudient).trigger("reset")
      $(elements.modalStudient).modal();
    })
  },

  createStudientElement: function(studient) {
    let trElement = "";
    trElement += "<tr data-id='" + studient.id + "'>";
    trElement += "<td><input type='checkbox'/></td>";
    trElement += "<td>" + studient.code + "</td>";
    trElement += "<td>" + studient.fullName + "</td>";
    trElement += "<td>" + studient.birthDate + "</td>";
    trElement += "<td>" + studient.sex + "</td>";
    trElement += "<td>" + studient.address + "</td>";
    trElement += "<td>" + studient.phone + "</td>";
    trElement += "<td>" + studient.department + "</td>";
    trElement += "<td>" + studient.majorObject + "</td>";
    trElement += "<td><button data-id=" + studient.id + " type='button' class='btn btn-secondary btn-update-studient'><i class='far fa-edit'></i></button></td>";
    trElement += "<td><button data-id=" + studient.id + " type='button' class='btn btn-secondary btn-delete-studient'><i class='far fa-trash-alt'></i></button></td>";
    trElement += "</tr>";
    return trElement;
  },

  renderListStudient: function (studients) {
    let trElements = "";
    trElements = studients.reduce(
      (
        accumulator, studient) => {
          let trElement = this.createStudientElement(studient);
          return accumulator + trElement;
        }, trElements
      );
    $(elements.tableBodyStudients).empty().append(trElements);
  },

  submitFormStudient: function() {
    $(elements.buttonSubmitFormStudient).on("click", function (event) {
      if ($(elements.formStudient).valid() === false) {
        event.preventDefault();
        $(elements.labelError).addClass("text-danger");
      } else {
        let studient = commons.formDataToJson($(elements.formStudient));
        if(!studient.id) {
          studient.id = Math.floor(Math.random() * 100);
          let trElement = events.createStudientElement(studient);
          $(elements.tableBodyStudients).append(trElement);
          studients.push(studient);
        } else {
          let updateElement = $(elements.tableBodyStudients).find("tr[data-id=" + studient.id + "]");
          if(updateElement) {
            updateElement.replaceWith(events.createStudientElement(studient));
            let studientIndex = studients.findIndex(item => item.id == studient.id);
			studient.id = parseFloat(studient.id);
            studients[studientIndex] = studient;
          }
        }
      }
    })
  },

  checkAllStudient: function() {
    $(elements.buttonCheckAll).on("change", function() {
      let checkBoxes = commons.checkAllCheckBoxOfTable($(this));
      console.log(checkBoxes);
    })
  },

  deleteListStudient: function() {
    $(elements.buttonDeleteListStudient).on("click", function() {
      let checkBoxes = commons.getCheckedBoxOfTable($(elements.tableStudients));
      if(checkBoxes.length) {
        checkBoxes.each(function() {
          $(this).parent().parent().remove();
        })
      } else {
        alert(MESSAGE_SELECT_STUDIENT);
      }
    })
  },

  deleteOneStudient: function() {
    $(document).on("click", elements.buttonDeleteStudient, function() {
      $(this).parent().parent().remove();
    })
  },

  openModalUpdateStudient: function() {
    $(document).on("click", elements.buttonUpdateStudient, function() {
      let studientId = $(this).data("id");
      let studientIndex = studients.findIndex(item => item.id === studientId);
      let studient = studients[studientIndex];
      commons.populateFormData($(elements.formStudient), studient);
      events.displayMajorObjectByDepartment(studient.department);
      $(elements.modalStudientTitle).text(MODAL_TITLE_UPDATE);
      $(elements.buttonSubmitFormStudient).text("Update");
      $(elements.modalStudient).modal();
    })
  },

  changeMajorObjectByDepartment: function() {
    $(elements.inputDepartment).on("change", function() {
      $(elements.inputMajorObject).val("");
      let departmentValue = $(this).val();
      events.displayMajorObjectByDepartment(departmentValue);
    })
  },

  displayMajorObjectByDepartment: function(departmentValue) {
    let optionElements = $(elements.inputMajorObject).find("option").not(":first");
    optionElements.each(function(i, elm) {
      if($(elm).data("department") == departmentValue) {
        $(elm).removeClass("d-none");
      } else {
        $(elm).addClass("d-none");
      }
    })
  }
};

"use strict";

jQuery(document).ready(function () {
  events.init();
});

