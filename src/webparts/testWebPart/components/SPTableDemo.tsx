import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { sp } from "@pnp/sp";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./CrudDesign.scss";
import { FaCheck, FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import * as moment from "moment";
import { Button } from "primereact/button";
import { ImCancelCircle } from "react-icons/im";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Persona } from "office-ui-fabric-react";
import { Toast } from "primereact/toast";
import { RxReset } from "react-icons/rx";

import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";

export default function SPTableDemo(props) {
  const [ListName, setListName] = useState("HelpDeskCategories");
  const [DetailPopup, setDetailPopup] = useState(false);
  const [DisplayListData, setDisplayListData] = useState([]);
  const [MasterData, setMasterData] = useState([]);

  const [TestChoiceArrAll, setTestChoiceArrAll] = useState([]);
  const [DepartmentLookupArrAll, setDepartmentLookupArrAll] = useState([]);
  const [UpdateItemFlag, setUpdateItemFlag] = useState(false);
  const [UpdateItemID, setUpdateItemID] = useState(null);

  const toast = useRef(null);

  //New Item Object
  const [NewItemObj, setNewItemObj] = useState({
    Title: "",
    TestNumber: null,
    TestDate: "",
    TestYesOrNo: false,
    TestChoice: "",
    DepartmentsID: null,
    DepartmentsValue: "",
    PersonID: null,
    PersonEmail: "",
  });
  //Filter Object

  const [FilterObj, setFilterObj] = useState({
    Text: "",
    Date: "",
    Choice: "",
  });
  //Get SPList
  const GetListDetails = () => {
    sp.web.lists
      .getByTitle(ListName)
      .items.select(
        "*",
        "TestPerson/Id",
        "TestPerson/EMail",
        "TestPerson/Title",
        "Departments/Title",
        "DepartmentsId"
      )
      .expand("TestPerson", "Departments")
      .filter("IsDelete eq null or IsDelete eq false")
      .get()
      .then((res) => {
        const TempArr: any = [];

        res.forEach((data) => {
          TempArr.push({
            ID: data.Id,
            Category: data.Title,
            Department: data.DepartmentsId && {
              ID: data.DepartmentsId,
              Title: data.Departments.Title,
            },
            PeoplePicker: data.TestPersonId && {
              ID: data.TestPerson.Id,
              Name: data.TestPerson.Title,
              Email: data.TestPerson.EMail,
            },
            Choice: data.TestChoice,
            Number: data.TestNumber,
            YesOrNo: data.TestYesOrNo,
            Date: data.TestDate,
          });
        });
        setMasterData([...TempArr]);
        setDisplayListData([...TempArr]);
      })

      .catch((err) => {
        console.log("err", err);
      });
  };

  //Get Choice

  const TestChoicesAll = (ColumnName) => {
    sp.web.lists
      .getByTitle(ListName)
      .fields.getByInternalNameOrTitle(ColumnName)
      .get()
      .then((res: any) => {
        const TestChoiceArr: [] = res.Choices.map((value) => ({
          name: value,
        }));

        setTestChoiceArrAll([...TestChoiceArr]);
      })
      .catch((e) => {
        console.log("ChoiceErr", e);
      });
  };

  //Get Department Lookup

  const DepartMentLookupFunc = (ColumnName) => {
    sp.web.lists
      .getByTitle(ListName)
      .fields.getByInternalNameOrTitle(ColumnName)
      .get()
      .then((res: any) => {
        sp.web.lists
          .getById(res.LookupList)
          .items.select("*")
          .get()
          .then((res1) => {
            const TempLookUpArr = [];

            res1.forEach((data) => {
              TempLookUpArr.push({
                Id: data.ID,
                name: data.Title,
              });
            });

            setDepartmentLookupArrAll([...TempLookUpArr]);
          });

        // const TestChoiceArr: [] = res.Choices.map((value) => ({
        //   name: value,
        //   ID:
        // }));
        // console.log("TestChoiceArr", TestChoiceArr);

        // setDepartmentLookupArrAll([...TestChoiceArr]);
      })
      .catch((e) => {
        console.log("ChoiceErr", e);
      });
  };
  //ADDItem Function

  const ADDItem = () => {
    sp.web.lists
      .getByTitle(ListName)
      .items.add({
        Title: NewItemObj.Title,
        TestNumber: NewItemObj.TestNumber,
        TestDate: NewItemObj.TestDate,
        TestYesOrNo: NewItemObj.TestYesOrNo,
        TestChoice: NewItemObj.TestChoice,
        DepartmentsId: NewItemObj.DepartmentsID,
        TestPersonId: NewItemObj.PersonID,
      })
      .then((res) => {
        GetListDetails();
        // const AddTemArr = {
        //   ID: res.data?.Id,
        //   Category: res.data?.Title,
        //   Department: res.data.DepartmentsId && {
        //     ID: res.data?.DepartmentsId,
        //     Title: NewItemObj.DepartmentsValue,
        //   },
        //   // PeoplePicker: {
        //   //   ID: res.data?.TestPerson.Id,
        //   //   Name: res.data?.TestPerson.Title,
        //   //   Email: res.data?.TestPerson.EMail,
        //   // },
        //   Choice: res.data?.TestChoice,
        //   Number: res.data?.TestNumber,
        //   YesOrNo: res.data?.TestYesOrNo,
        //   Date: res.data?.TestDate,
        // };
        // setDisplayListData([...DisplayListData, { ...AddTemArr }]);

        setDetailPopup(false);
      })
      .catch((e) => {
        console.log("AddErr", e);
      });
  };

  //Update Function

  const UpdateItem = (ItemID) => {
    sp.web.lists
      .getByTitle(ListName)
      .items.getById(ItemID)
      .update({
        Title: NewItemObj.Title,
        TestNumber: NewItemObj.TestNumber,
        TestDate: NewItemObj.TestDate,
        TestYesOrNo: NewItemObj.TestYesOrNo,
        TestChoice: NewItemObj.TestChoice,
        DepartmentsId: NewItemObj.DepartmentsID,
        TestPersonId: NewItemObj.PersonID,
      })
      .then(() => {
        GetListDetails();
        setUpdateItemFlag(false);
        setDetailPopup(false);
      })
      .catch((e) => {
        console.log("UpdateErro", e);
      });
  };
  //Delete function
  const DeleteItem = (ItemID) => {
    sp.web.lists
      .getByTitle(ListName)
      .items.getById(ItemID)
      .update({
        IsDelete: true,
      })
      .then((res) => GetListDetails())
      .catch((e) => {
        console.log("DeleteErr", e);
      });
  };
  //Edit Click
  const HandleEditClick = (EditData) => {
    setNewItemObj({
      Title: EditData.Category,
      TestNumber: EditData.Number,
      TestDate: EditData.Date,
      TestYesOrNo: EditData.YesOrNo,
      TestChoice: EditData.Choice,
      DepartmentsID: EditData.Department.ID,
      DepartmentsValue: EditData.Department.Title,
      PersonID: EditData.PeoplePicker?.ID,
      PersonEmail: EditData.PeoplePicker?.Email,
    });
  };

  useEffect(() => {
    GetListDetails();
    DepartMentLookupFunc("Departments");
    TestChoicesAll("TestChoice");
  }, []);

  //NewItemObj Add Function

  const AddItemNew = (Key, Value) => {
    NewItemObj[Key] = Value;
    setNewItemObj({ ...NewItemObj });
  };

  //Error Message
  const ErrorMsgDetail = () => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Fill all details",
    });
  };

  ///Validation Check

  const validation = () => {
    NewItemObj.Title === "" ||
    NewItemObj.DepartmentsID === null ||
    NewItemObj.PersonID === null ||
    NewItemObj.TestChoice === "" ||
    NewItemObj.TestDate === "" ||
    NewItemObj.TestNumber === null
      ? ErrorMsgDetail()
      : UpdateItemFlag
      ? UpdateItem(UpdateItemID)
      : ADDItem();
  };
  console.log("FilterObj", FilterObj);
  //Filter Data
  const FilterItem = (key, Data) => {
    console.log("FilterObj", FilterObj);
    FilterObj[key] = Data;
    setFilterObj({ ...FilterObj });
    console.log("FilterObj", FilterObj);
    let FilterDataArr = MasterData;
    if (FilterObj.Text || FilterObj.Choice || FilterObj.Date) {
      FilterObj.Text
        ? (FilterDataArr = FilterDataArr.filter(
            (e) =>
              (e.Category &&
                e.Category.toLowerCase().includes(
                  FilterObj.Text.toLowerCase()
                )) ||
              (e.Department &&
                e.Department.Title.toLowerCase().includes(
                  FilterObj.Text.toLowerCase()
                )) ||
              (e.PeoplePicker?.Name &&
                e.PeoplePicker.Name.toLowerCase().includes(
                  FilterObj.Text.toLowerCase()
                ))
          ))
        : (FilterDataArr = FilterDataArr);

      FilterObj.Date
        ? (FilterDataArr = FilterDataArr.filter(
            (e) =>
              e.Date && moment(e.Date).format("MM/DD/YYYY") == FilterObj.Date
          ))
        : (FilterDataArr = FilterDataArr);
      FilterObj.Choice
        ? (FilterDataArr = FilterDataArr.filter(
            (e) => e.Choice && e.Choice === FilterObj.Choice
          ))
        : (FilterDataArr = FilterDataArr);

      setDisplayListData([...FilterDataArr]);
    } else {
      console.log("FilterEMpty");
      setDisplayListData([...MasterData]);
    }
  };
  //Return
  return (
    <div className="MainCrud">
      <Toast ref={toast} />
      {DetailPopup && (
        <div className="NewPopup">
          <div className="PopupInputContainer">
            <div className="Title">
              <label style={{ width: "100%" }}>Add Record </label>{" "}
              <ImCancelCircle onClick={() => setDetailPopup(false)} />
            </div>
            <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                Category
              </label>{" "}
              <InputText
                value={NewItemObj.Title}
                type="text"
                onChange={(e) => AddItemNew("Title", e.target?.value || "")}
              />
            </div>
            <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                Number
              </label>
              <InputText
                value={NewItemObj.TestNumber}
                type="number"
                onChange={(e) =>
                  AddItemNew("TestNumber", e.target.value || null)
                }
              />
            </div>
            <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                Yes Or No
              </label>
              <div style={{ width: "250px" }}>
                <Checkbox
                  onChange={(e) => {
                    AddItemNew("TestYesOrNo", !NewItemObj.TestYesOrNo);
                  }}
                  checked={NewItemObj.TestYesOrNo}
                ></Checkbox>
              </div>
            </div>
            <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                Date
              </label>
              <Calendar
                value={new Date(NewItemObj.TestDate)}
                onChange={(e) => {
                  AddItemNew("TestDate", e.target.value || "");
                }}
              />
            </div>
            <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                Choice
              </label>
              <Dropdown
                value={TestChoiceArrAll.find(
                  (value) => value.name === NewItemObj.TestChoice
                )}
                options={TestChoiceArrAll}
                onChange={(e) => {
                  AddItemNew("TestChoice", e.target.value.name || "");
                }}
                optionLabel="name"
                placeholder="Select a choice"
                className="p-dropdow"
              />
            </div>
            <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                Departments
              </label>
              <Dropdown
                value={DepartmentLookupArrAll.find(
                  (e) => e.name === NewItemObj.DepartmentsValue
                )}
                options={DepartmentLookupArrAll}
                onChange={(e) => {
                  AddItemNew("DepartmentsID", e.target.value.Id || null);
                  AddItemNew("DepartmentsValue", e.target.value.name || "");
                }}
                optionLabel="name"
                placeholder="Select department"
                className="p-dropdow"
              />
            </div>
            <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                People
              </label>
              <PeoplePicker
                context={props.context}
                personSelectionLimit={1}
                ensureUser={true}
                showtooltip={true}
                required={true}
                defaultSelectedUsers={
                  NewItemObj.PersonEmail ? [NewItemObj.PersonEmail] : []
                }
                onChange={(e) => {
                  AddItemNew("PersonID", e.length > 0 ? e[0].id : null);
                }}
                webAbsoluteUrl={props.context._pageContext._web.absoluteUrl}
                principalTypes={[PrincipalType.User]}

                //resolveDelay={1000}
              />
            </div>
            {/* <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                Mobile Number
              </label>
              <InputText type="number" />
            </div>
            <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                Department
              </label>
              <Dropdown
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
              <InputTextarea rows={5} cols={30} />
            </div>
            <div className="DataRow">
              <label style={{ width: "150px", alignItems: "start" }}>
                Upload Picture
              </label>
              <InputText disabled type="text" />
            </div>*/}
            <div className="SubmitBtnDataRow">
              <Button
                label="Submit"
                icon={<FaCheck />}
                onClick={() => {
                  validation();
                  // , console.log("ErrorMsg", ErrorMsg);
                  // ErrorMsg
                  //   ? ErrorMsgDetail()
                  //   : UpdateItemFlag
                  //   ? UpdateItem(UpdateItemID)
                  //   : ADDItem();
                }}
              />
            </div>
          </div>
        </div>
      )}
      {!DetailPopup && (
        <div className="FilterComponent">
          <InputText
            type="text"
            value={FilterObj.Text}
            placeholder="Search here"
            onChange={(e) => {
              FilterItem("Text", e.target.value);
            }}
          />
          <Calendar
            value={new Date(FilterObj.Date)}
            placeholder="Select date"
            onChange={(e) => {
              FilterItem(
                "Date",
                e.target.value
                  ? moment(e.target.value).format("MM/DD/YYYY")
                  : ""
              );
            }}
          />
          <Dropdown
            value={TestChoiceArrAll.find((e) => e.name === FilterObj.Choice)}
            showClear
            options={TestChoiceArrAll}
            onChange={(e) => {
              FilterItem("Choice", e.target.value ? e.target.value.name : "");
            }}
            optionLabel="name"
            placeholder="Select a choice"
            className="p-dropdow"
          />
          <Button
            label="Add New"
            icon={FaPlus}
            onClick={() => {
              setDetailPopup(true);
              setNewItemObj({
                Title: "",
                TestNumber: null,
                TestDate: "",
                TestYesOrNo: false,
                TestChoice: "",
                DepartmentsID: null,
                DepartmentsValue: "",
                PersonID: null,
                PersonEmail: "",
              });
            }}
          ></Button>
          <Button
            label="Reset"
            icon={RxReset}
            onClick={() => {
              setFilterObj({ Text: "", Date: "", Choice: "" });
              setDisplayListData([...MasterData]);

              // FilterItem("", "");
            }}
          ></Button>
        </div>
      )}
      {!DetailPopup && (
        <DataTable
          value={DisplayListData}
          paginator
          rows={5}
          rowsPerPageOptions={[5,10]}
          showGridlines
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="ID" header="ID"></Column>
          <Column field="Category" header="Category"></Column>
          <Column field="Department.Title" header="Department"></Column>
          <Column
            body={(rowData) => (
              <>
                {rowData.PeoplePicker?.Name ? (
                  <Persona
                    text={rowData.PeoplePicker.Name}
                    imageUrl={
                      "/_layouts/15/userphoto.aspx?size=S&username=${props.context._pageContext._user.email}"
                    }
                  />
                ) : (
                  "-"
                )}
              </>
            )}
            field="PeoplePicker.Name"
            header="Person"
          ></Column>
          <Column field="Choice" header="ChoiceColumn"></Column>
          <Column field="Number" header="NumberColumn"></Column>
          <Column
            body={(rowdata) => (rowdata.YesOrNo === true ? "Yes" : "No")}
            header="YesOrNoCoulmn"
          ></Column>
          <Column
            body={(rowdata) =>
              rowdata.Date ? moment(rowdata.Date).format("DD/MM/YYYY") : "-"
            }
            header="DateColumn"
          ></Column>
          <Column
            body={(rowdata) => (
              <>
                <FaEdit
                  onClick={() => {
                    setUpdateItemID(rowdata.ID);
                    HandleEditClick(rowdata);
                    setUpdateItemFlag(true);
                    setDetailPopup(true);
                  }}
                  style={{ marginRight: "5px", cursor: "pointer" }}
                />
                <FaTrash
                  onClick={() => {
                    DeleteItem(rowdata.ID);
                  }}
                  style={{ marginRight: "5px", cursor: "pointer" }}
                />
              </>
            )}
          ></Column>
        </DataTable>
      )}
    </div>
  );
}
