import React from 'react';
import { userService } from '@/_services';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import config from 'config';

const { EventHubConsumerClient, earliestEventPosition, latestEventPosition } = require("@azure/event-hubs");

function uintToString(uintArray) {
  var encodedString = String.fromCharCode.apply(null, uintArray),
      decodedString = decodeURIComponent(escape(encodedString));
  return decodedString;
}

async function listenImageUploaded() {
  const client = new EventHubConsumerClient(
    "",
    "Endpoint=sb://[event hub name].servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=[shared acess key]",
    "[topic name]"
  );

  // In this sample, we use the position of earliest available event to start from
  // Other common options to configure would be `maxBatchSize` and `maxWaitTimeInSeconds`
  const subscriptionOptions = {
    startPosition: latestEventPosition
  };

  const subscription = client.subscribe(
    {
      processEvents: async(events, context) => {
        var lastEvent = events[events.length - 1];
        console.log(uintToString(lastEvent.body))

      
        var profileImage = document.getElementById("prfimg");
        profileImage.src = "https://[name of blob storage].blob.core.windows.net/imgcontainer/" + lastEvent.body + ".jpg";
      },
      processError: async(err, context) => {
        console.log(err);
      }
    },
    subscriptionOptions
  );

  // Wait for a few seconds to receive events before closing
  setTimeout(async () => {
    await subscription.close();
    await client.close();
    alert('closed');
    console.log(`Exiting sample`);
  }, 100 * 1000);
}



class ProfilePage extends React.Component {
  
  constructor(props) {
    super(props);

    

    this.state = {
      userProfile:  null,
      selectedFile: null
  };

    userService.getUserProfile().then(userProfile => {
      this.setState({ userProfile })
    });


}


  render() {

    const onFileChange = event => {
    
      // Update the state
      this.setState({ selectedFile: event.target.files[0] });
    
    };

    const fileData = () => {
    
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    
  };

  const onFileUpload = () => {
      // Create an object of formData
      const formData = new FormData();
    
      // Update the formData object
      formData.append(
        "image",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
    
      // Details of the uploaded file
      console.log(this.state.selectedFile);
    
      // Request made to the backend api
      // Send formData object
      axios.post(`${config.apiUrl}/api/upload`, formData);
      listenImageUploaded();
    };
    
    const { userProfile } = this.state;

    return (
        <div>

<div>
            <p>
              Upload profile photo
            </p>
            <div>
                <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                  Upload!
                </button>
            </div>
         
        </div>

        <br/>
        <br/>


          {userProfile &&
          <div>
 {
  userProfile.profileImageId &&
  <div>
<img 
      id="prfimg"
      src={`https://[blob storage name].blob.core.windows.net/imgcontainer/${userProfile.profileImageId}.jpg`}
      alt="new"
      />
      </div>
  }

            <Formik
                    initialValues={{
                        username: userProfile.username || '',
                        description: userProfile.description || '',
                        city: userProfile.city || ''
                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        description: Yup.string().required('Description is required'),
                        city: Yup.string().required('Description is required')
                    })}
                    enableReinitialize={true}
                    onSubmit={({ username, description, city }, { setStatus, setSubmitting }) => {
                        setStatus();
                        userService.updateUserProfile({username, description, city})
                            .then(
                                user => {
                                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                                    this.props.history.push(from);
                                },
                                error => {
                                    setSubmitting(false);
                                    setStatus(error);
                                }
                            );
                    }}
                    render={({ errors,  touched, isSubmitting }) => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <Field name="description" type="text" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                <ErrorMessage name="description" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <Field name="city" type="text" className={'form-control' + (errors.city && touched.city ? ' is-invalid' : '')} />
                                <ErrorMessage name="city" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Update profile</button>
                                {isSubmitting &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                        
                        </Form>
                    )}
                />
            </div>}
        </div>
    )
  }
}

export { ProfilePage }; 