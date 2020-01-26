import React, { Component } from 'react';
import '../Layout/Layout.css'

class AdminPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            content : ''
        }
      }
      handleAdmin= (status) => {
        if(status === '1'){ // admin 일 때
          this.setState({
            content: 'Hi ! Admin'
          });
        } else {
          this.setState({ // 아닐 때
            content: '접근 권한이 없습니다.',
          });
        }
      }
      componentDidMount() {
          this.handleAdmin(this.props.admin);
      }
      render () {
          console.log('admin 여부 '+this.props.admin);
        return (
            <>
            <div className="content">
              <h2 className="info_title">{this.state.content}</h2>
            </div>
           </>
          );
      }
}
export default AdminPage;