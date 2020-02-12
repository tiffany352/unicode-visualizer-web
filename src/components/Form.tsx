import React, { FormEvent } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

type Props = {
  className: string;
  path: () => string;
};

class NavForm extends React.Component<Props & RouteComponentProps> {
  submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.history.push(this.props.path());
  };

  render() {
    return (
      <form onSubmit={this.submitHandler} className={this.props.className}>
        {this.props.children}
      </form>
    );
  }
}

export default withRouter(NavForm);
