import * as React from "react";
import { useState, useEffect } from "react";
import "./CrudDesign.scss";
import { Button } from "primereact/button";
import { FaPlus } from "react-icons/fa6";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ImCancelCircle } from "react-icons/im";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { FaCheck } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

function Crud() {
  //Edit Mode
  const [EditMode, setEditMode] = useState(false);
  const [EditRow, setEditRow] = useState(null);
  //Open AddPopup
  const [Addnew, SetAddnew] = useState(false);
  //Gender Radio Button
  const [GenderRadio, setGenderRadio] = useState(null);
  //Department Opions

  const Departments: { name: string; value: number }[] = [
    { name: "IT", value: 0 },
    { name: "HR", value: 1 },
    { name: "SalesForce", value: 2 },
    { name: "Finance", value: 3 },
  ];

  //Skills Options
  const [SelectedSkills, setSelectedSkills] = useState(null);
  const Skills = [
    { name: "Java", value: 0 },
    { name: "Power FX", value: 1 },
    { name: "Python", value: 2 },
    { name: "C++", value: 3 },
    { name: ".Net", value: 4 },
  ];

  //Add Temp Record
  const [TableData, setTableData] = useState({
    EmployeeID: null,
    EmployeeName: "",
    Gender: "",
    EmailID: "",
    MobileNumber: null,
    DepartMent: "",
    Skills: [],
    Address: "",
  });
  //Temp Skills

  function AddSingleRec(Key, Value) {
    if (Key === "DepartMent") {
      TableData[Key] = Departments[Value].name;
    } else if (Key === "Skills") {
      TableData[Key] = Value.map((e) => {
        return Skills[e].name;
      });
    } else {
      TableData[Key] = Value;
    }
    setTableData({ ...TableData });
    // console.log("TableData", TableData);
  }

  //Final Table Data
  const [FinalTable, setFinalTable] = useState([]);

  function FinalTableData() {
    if (EditMode) {
      FinalTable.splice(EditRow, 1);
      setFinalTable([{ ...TableData }, ...FinalTable]);
    } else {
      setFinalTable([{ ...TableData }, ...FinalTable]);
    }
    console.log("FinalTable", FinalTable);
    setTableData({
      EmployeeID: null,
      EmployeeName: "",
      Gender: "",
      EmailID: "",
      MobileNumber: null,
      DepartMent: "",
      Skills: [],
      Address: "",
    });
    setEditMode(false);
    SetAddnew(false);
  }

  //Edit Function
  function handleEditClick(RowData, RowIndex) {
    setEditMode(true);
    console.log(RowData, RowIndex);
    setTableData({
      Address: RowData.Address,
      DepartMent: RowData.DepartMent,
      EmailID: RowData.EmailID,
      EmployeeID: RowData.EmployeeID,
      EmployeeName: RowData.EmployeeName,
      Gender: RowData.Gender,
      MobileNumber: RowData.MobileNumber,
      Skills: RowData.Skills,
    });
    setEditRow(RowIndex);
    console.log("TableData", TableData);
    SetAddnew(true);
  }
  //Delete Function
  function handleDeleteClick(RowData, RowIndex) {
    FinalTable.splice(RowIndex, 1);
    setFinalTable([...FinalTable]);
  }
  //Return
  return (
    <>
      <div className="MainCrud">
        {Addnew && (
          <div className="NewPopup">
            <div className="PopupInputContainer">
              <div className="Title">
                <label style={{ width: "100%" }}>Add Record </label>{" "}
                <ImCancelCircle
                  onClick={() => {
                    SetAddnew(!Addnew);
                    setTableData({
                      EmployeeID: null,
                      EmployeeName: "",
                      Gender: "",
                      EmailID: "",
                      MobileNumber: null,
                      DepartMent: "",
                      Skills: [],
                      Address: "",
                    });
                    setGenderRadio(null);

                    setSelectedSkills(null);
                  }}
                />
              </div>
              <div className="DataRow">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Employee ID
                </label>{" "}
                <InputText
                  value={TableData.EmployeeID}
                  type="number"
                  onChange={(e) => {
                    AddSingleRec("EmployeeID", e.target.value);
                  }}
                />
              </div>
              <div className="DataRow">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Employee Name
                </label>
                <InputText
                  value={TableData.EmployeeName}
                  type="text"
                  onChange={(e) => {
                    AddSingleRec("EmployeeName", e.target.value);
                  }}
                />
              </div>
              <div className="DataRow">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Gender
                </label>
                <div className="GenderRaioDiv">
                  <div className="flex align-items-center">
                    <RadioButton
                      inputId="ingredient1"
                      name="Gender"
                      value="Male"
                      onChange={(e) => {
                        setGenderRadio(e.value);
                        {
                          e.checked && AddSingleRec("Gender", e.target.value);
                        }
                      }}
                      checked={
                        GenderRadio === "Male" || TableData.Gender === "Male"
                      }
                    />
                    <label htmlFor="ingredient1" className="ml-2">
                      Male
                    </label>
                  </div>
                  <div className="flex align-items-center">
                    <RadioButton
                      inputId="ingredient2"
                      name="Gender"
                      value="Female"
                      onChange={(e) => {
                        setGenderRadio(e.value);
                        {
                          e.checked && AddSingleRec("Gender", e.target.value);
                        }
                      }}
                      checked={
                        GenderRadio === "Female" ||
                        TableData.Gender === "Female"
                      }
                    />
                    <label htmlFor="ingredient2" className="ml-2">
                      Female
                    </label>
                  </div>
                </div>
              </div>
              <div className="DataRow">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Email ID
                </label>
                <InputText
                  type="text"
                  value={TableData.EmailID}
                  onChange={(e) => {
                    AddSingleRec("EmailID", e.target.value);
                  }}
                />
              </div>
              <div className="DataRow">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Mobile Number
                </label>
                <InputText
                  type="number"
                  value={TableData.MobileNumber}
                  onChange={(e) => {
                    AddSingleRec("MobileNumber", e.target.value);
                  }}
                />
              </div>
              <div className="DataRow">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Department
                </label>
                <Dropdown
                  value={Departments.map((dept) => dept.name).indexOf(
                    TableData.DepartMent
                  )}
                  onChange={(e) => {
                    AddSingleRec("DepartMent", e.value);
                  }}
                  options={Departments}
                  optionLabel="name"
                  placeholder="Select a department"
                  className="p-dropdow"
                />
              </div>
              <div className="DataRow">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Skills
                </label>
                <MultiSelect
                  value={TableData.Skills.map((name) =>
                    Skills.map((e) => e.name).indexOf(name)
                  )}
                  onChange={(e) => {
                    setSelectedSkills(e.value);
                    AddSingleRec("Skills", e.value);
                  }}
                  options={Skills}
                  optionLabel="name"
                  display="chip"
                  placeholder="Select Skills"
                  maxSelectedLabels={3}
                  className="p-dropdown"
                />
              </div>
              <div className="DataRow">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Manager
                </label>
                <InputText disabled type="text" />
              </div>
              <div className="DataRowMultiline">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Address
                </label>
                <InputTextarea
                  value={TableData.Address}
                  rows={5}
                  cols={30}
                  onChange={(e) => {
                    AddSingleRec("Address", e.target.value);
                  }}
                />
              </div>
              <div className="DataRow">
                <label style={{ width: "150px", alignItems: "start" }}>
                  Upload Picture
                </label>
                <InputText disabled type="text" />
              </div>
              <div className="SubmitBtnDataRow">
                <Button
                  label="Submit"
                  onClick={() => {
                    FinalTableData();
                  }}
                  icon={<FaCheck />}
                />
              </div>
            </div>
          </div>
        )}
        {!Addnew && (
          <div className="FilterComponent">
            <Button
              label="New"
              icon={FaPlus}
              iconPos="left"
              onClick={() => {
                SetAddnew(true);
                setTableData({
                  EmployeeID: null,
                  EmployeeName: "",
                  Gender: "",
                  EmailID: "",
                  MobileNumber: null,
                  DepartMent: "",
                  Skills: [],
                  Address: "",
                });
                setGenderRadio(null);

                setSelectedSkills(null);
              }}
            />
          </div>
        )}
        {!Addnew && (
          <DataTable
            value={FinalTable}
            showGridlines
            paginator
            rows={5}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column field="EmployeeID" header="Employee ID"></Column>
            <Column field="EmployeeName" header="Employee Name"></Column>
            <Column field="Gender" header="Gender"></Column>
            <Column field="EmailID" header="Email ID"></Column>
            <Column field="MobileNumber" header="Mobile Number"></Column>
            <Column field="DepartMent" header="Department"></Column>
            <Column field="Skills" body={(rowData)=>(rowData.Skills.join(","))} header="Skills"></Column>
            <Column field="Manager" header="Manager"></Column>
            <Column field="Address" header="Address"></Column>
            <Column field="EmployeePhoto" header="Employee Photo"></Column>
            <Column
              style={{ flex: "0 0 4rem" }}
              body={(rowData, { rowIndex }) => (
                <>
                  <FaEdit
                    style={{ cursor: "pointer", marginRight: "5px" }}
                    onClick={(e) => {
                      handleEditClick(rowData, rowIndex);
                    }}
                  />
                  <FaTrashAlt
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      handleDeleteClick(rowData, rowIndex);
                    }}
                  />
                </>
              )}
            ></Column>
          </DataTable>
        )}
      </div>
    </>
  );
}

export default Crud;
