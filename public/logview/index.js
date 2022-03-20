


export default async function main() {
    console.log('start...')


    const logList = document.querySelector('#logList')
    const addLogForm = document.querySelector('#addLog')
    // const removeFrom = document.querySelector('#removeForm')
    // const updateFrom = document.querySelector('#updateForm')

    let _selectLog = null

    logList.addEventListener('click', async function (e) {
        if (e.target.tagName === 'LI') {

            _selectLog = e.target
            _selectLog.classList.add('selected')

            logList.querySelectorAll('li').forEach(li => {
                if (li !== _selectLog) {
                    li.classList.remove('selected')
                }
            })

            // updateLoglist()
        }
    });


    async function getTotalCount() {
        try {
            let _result = await (await fetch('/api/log/count',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('jwt_token')
                    }
                })).json()

            if (_result.r === 'ok') {
                return _result.info
            }
            else {
                throw new Error(_result.info)
            }
            // logList.querySelector('h3').innerText = `${_result.info}`

        }
        catch (err) {
            console.log(err)
            return 0
        }
    }



    async function updateLoglist() {

        try {

            const statusInfo = logList.querySelector('h3')
            statusInfo.innerText = 'conneting...'

            let _result = await (await fetch('/api/log/list?skip=0&limit=10',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('jwt_token')
                    }
                }
            )).json()

            console.log(_result)

            if (_result.r === 'ok') {
                // logList.innerHTML = ''

                //clear child ul
                let ul = logList.querySelector('ul')
                while (ul.firstChild) {
                    ul.removeChild(ul.firstChild)
                }
                _result.info.forEach(log => {
                    const logItem = document.createElement('li')
                    logItem.innerText = `${log.date} : ${log.content}`
                    logItem.dataset.id = log._id
                    ul.appendChild(logItem)
                });

                let _count = await getTotalCount()
                // console.log(_count)
                statusInfo.innerText = ` total : ${_count}`
            }
            else {
                alert(_result.info)
            }
        }
        catch (e) {
            console.error(e)
        }

    }

    updateLoglist()


    addLogForm.querySelector('.add').addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            let _result = await (await fetch('/api/log/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('jwt_token')
                },
                body: JSON.stringify({
                    content: addLogForm.querySelector('input').value
                })
            })).json()

            if (_result.r === 'ok') {
                updateLoglist()
            }
            else {
                alert(_result.info)
            }

        }
        catch (e) {
            console.error(e)
        }
    });

    addLogForm.querySelector('.del').addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            let _result = await (await fetch(
                `/api/log/delete?id=${_selectLog.dataset.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('jwt_token')
                }
            })).json()

            if (_result.r === 'ok') {
                updateLoglist()
            }
            else {
                alert(_result.info)
            }

        }
        catch (e) {
            console.error(e)
        }
    });

    addLogForm.querySelector('.update').addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            let _result = await (await fetch(
                `/api/log/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('jwt_token')
                },
                body: JSON.stringify({
                    id: _selectLog.dataset.id,
                    content: addLogForm.querySelector('input').value
                })
            })).json()

            if (_result.r === 'ok') {
                updateLoglist()
            }
            else {
                console.log(_result.info)
                alert(_result.info)
            }

        }
        catch (e) {
            console.error(e)
        }
    });

    ///
    try {

        let _result = await (await fetch('/api/users',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('jwt_token')
                }
            })).json()
        // console.log(_result)
        if (_result.r === 'ok') {
            console.log(_result)

            document.querySelector('#userInfo').innerText = `${_result.user.userName} 님의 로그 목록`

        }

    }
    catch (e) {
        console.error(e)
    }

}