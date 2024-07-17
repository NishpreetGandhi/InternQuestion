$(document).ready(function () {
    initializeForm();

    $('#rollNo').on('input', function () {
        const rollNo = $(this).val().trim();
        console.log('Roll No input:', rollNo);
        if (rollNo) {
            const studentData = fetchStudentData(rollNo);
            console.log('Fetched student data:', studentData);
            if (studentData) {
                fillForm(studentData);
                activateFormFields();
                $('#saveBtn').prop('disabled', true);
                $('#updateBtn').prop('disabled', false);
                $('#resetBtn').prop('disabled', false);
            } else {
                activateFormFields();
                $('#saveBtn').prop('disabled', false);
                $('#updateBtn').prop('disabled', true);
                $('#resetBtn').prop('disabled', false);
            }
        } else {
            initializeForm();
        }
    });

    $('#saveBtn').on('click', function () {
        if (isFormCompleted()) {
            storeData();
            alert('Student data saved successfully!');
            initializeForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    $('#updateBtn').on('click', function () {
        if (isFormCompleted()) {
            storeData();
            alert('Student data updated successfully!');
            initializeForm();
        } else {
            alert('Please fill in all fields.');
        }
    });

    $('#resetBtn').on('click', function () {
        initializeForm();
    });
});

function initializeForm() {
    $('#studentForm')[0].reset();
    $('#rollNo').prop('disabled', false).focus();
    $('#fullName, #class, #birthDate, #address, #enrollmentDate').prop('disabled', true);
    $('#saveBtn, #updateBtn, #resetBtn').prop('disabled', true);
}

function activateFormFields() {
    $('#fullName, #class, #birthDate, #address, #enrollmentDate').prop('disabled', false);
    $('#rollNo').prop('disabled', true);
}

function isFormCompleted() {
    const formFields = $('#studentForm').serializeArray();
    return formFields.every(field => field.value.trim() !== '');
}

function collectFormData() {
    const formData = {};
    $('#studentForm').serializeArray().forEach(field => {
        formData[field.name] = field.value.trim();
    });
    return JSON.stringify(formData);
}

function fillForm(studentData) {
    $('#rollNo').val(studentData.rollNo).prop('disabled', true);
    $('#fullName').val(studentData.fullName);
    $('#class').val(studentData.class);
    $('#birthDate').val(studentData.birthDate);
    $('#address').val(studentData.address);
    $('#enrollmentDate').val(studentData.enrollmentDate);
}

function fetchStudentData(rollNo) {
    return JSON.parse(localStorage.getItem(rollNo));
}

function saveStudentData(studentData) {
    localStorage.setItem(studentData.rollNo, JSON.stringify(studentData));
}

function sendRequestToUrl(request, url) {
    var jsonObj;
    $.post(url, request, function (result) {
        jsonObj = result;
    }).fail(function (result) {
        jsonObj = result;
    });
    return jsonObj;
}

function storeData() {
    var jsonStrObj = collectFormData();
    if (jsonStrObj === '') {
        return '';
    }
    var connToken = '90932209|-31949213748908305|90963578';
    var empDBName = 'SCHOOL-DB';
    var empRelationName = 'STUDENT-TABLE';
    var putRequest = buildPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({ async: false });

    var url = 'http://api.login2explore.com:5577/api/iml';
    var resJsonObj = sendRequestToUrl(putRequest, url);
    console.log('Response from API:', resJsonObj);

    jQuery.ajaxSetup({ async: true });
    initializeForm();
    $('#rollNo').focus();
}

function buildPUTRequest(connToken, jsonStrObj, dbName, relName) {
    var putRequest = '{' +
        '"token" : "' + connToken +
        '","dbName": "' + dbName +
        '", "cmd" : "PUT", ' +
        '"rel" : "' + relName + '",' +
        '"jsonStr": ' +
        jsonStrObj +
        '}';
    return putRequest;
}