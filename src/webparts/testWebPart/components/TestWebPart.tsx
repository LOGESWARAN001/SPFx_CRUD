import * as React from "react";
import styles from "./TestWebPart.module.scss";
import { ITestWebPartProps } from "./ITestWebPartProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp/presets/all";
import MainComponent from "./HeaderComponent";
import Crud  from "./CRUD";
import MainToggleComponent from "./MainToggleComponent";
//import './SPTableDemo'
import SPTableDemo from "./SPTableDemo";


export default class TestWebPart extends React.Component<
  ITestWebPartProps,
  {}
> {
  constructor(prop: ITestWebPartProps, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
  }
  public render(): React.ReactElement<ITestWebPartProps> {

    console.log(this.props.context)
    return (
      <>
        <MainComponent context={this.props.context} />
        <Crud/>
        <SPTableDemo context={this.props.context} />
        

      </>
    );
  }
}
