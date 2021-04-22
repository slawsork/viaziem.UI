import { authenticationService } from '@/_services';

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                setTimeout(function(){
                    authenticationService.logout();
                    location.reload(true);
                }, 3000);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

export function handleSignupResponse(response) {
    return response.text().then(text => {
      
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                //authenticationService.logout();
               //location.reload(true);
            }

            const error = text || response.statusText;
            return Promise.reject(error);
        }

        return text;
    });
}