/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest;
    xhr.responseType = 'json'; // формат, в котором необходимо выдать результат

    xhr.onload = () => {
        options.callback(null, xhr.response);
    }

    xhr.onerror = () => {
        alert("Не удалось получить данные от сервера");
    }


    formData = new FormData;
    let params = "";
    let paramNum = 0;

    if (options.method != "GET" && options.data && Object.keys(options.data).length > 0) {
        Object.entries(options.data).forEach(([key, value]) => {
            formData.append( key, value );
        })
    } else {
        if (options.data && Object.keys(options.data).length > 0) {
            Object.entries(options.data).forEach(([key, value]) => {
                if (paramNum === 0) {
                    params += "?";
                }
                params += key + "=" + value;
                paramNum++;
                if (paramNum != Object.keys(options.data).length) {
                    params += "&";
                }
            })
        } 
    }

    try {
        xhr.open( options.method, options.url + params );
        xhr.send( formData );
    }
    catch ( e ) {
        options.callback( e, null );
    }
};
