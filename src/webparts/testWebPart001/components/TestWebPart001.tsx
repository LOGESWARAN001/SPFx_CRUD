import * as React from "react";
// import styles from './TestWebPart001.module.scss';
import { ITestWebPart001Props } from "./ITestWebPart001Props";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp/presets/all";
export default class TestWebPart001 extends React.Component<
  ITestWebPart001Props,
  {}
> {
  constructor(prop: ITestWebPart001Props, state: {}) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
  }
  
  public render(): React.ReactElement<ITestWebPart001Props> {
    console.log(this.props.context);
    return <>Test Web Part 001</>;
  }
}
