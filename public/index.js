export default async function main() {
    console.log('start...')

    const loginFrom = document.querySelector('#loginForm')
    // const addLogForm = document.querySelector('#addLog')
    const home = document.querySelector('#home')
    const registerForm = document.querySelector('#registerForm')
    // const logView = document.querySelector('#logView')

    const jwt_token = localStorage.getItem('jwt_token')

    if (jwt_token) {

        try {
            let _result = await (await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': jwt_token
                }
            })).json()

            if (_result.r === 'ok') {
                // logView.classList.remove('hide')

                home.querySelector('h2').innerText = `Welcome ${_result.user.userName}`


                home.classList.remove('hide')
                loginFrom.classList.add('hide')
                registerForm.classList.add('hide')
            }
            else {
                console.log(_result.info)
                alert(_result.info)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    document.querySelector('#logout').addEventListener('click', async function () {
        localStorage.removeItem('jwt_token')
        window.location.href = '/'
    });

    document.querySelector('#logview').addEventListener('click', async function (e) {
        window.location.href = '/logview'
    });



    loginFrom.addEventListener('submit', async (e) => {
        e.preventDefault()

        const _form = e.target

        try {
            let _result = await (await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: _form.userId.value,
                    userPw: _form.password.value
                })
            })).json()

            console.log(_result)
            if (_result.r === 'ok') {
                localStorage.setItem('jwt_token', _result.info.token)
                alert('로그인 성공')
                window.location.href = '/'
            }
            else {
                alert('아이디 또는 비밀번호가 잘못되었습니다.')
            }
        }
        catch (err) {
            console.log(err)
        }
    });


    loginFrom.querySelector('#register').addEventListener('click', async (e) => {
        e.preventDefault();
        // addLogForm.classList.add('hide')
        loginFrom.classList.add('hide')
        registerForm.classList.remove('hide')
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log(e.target)
        let _form = e.target

        let _result = await (await fetch('/api/users/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: _form.userName.value,
                userId: _form.userId.value,
                userPw: _form.userPw.value
            })
        })).json()

        if (_result.r === 'ok') {
            alert('회원가입 성공')
            // location.href = '/'

            loginFrom.classList.remove('hide')
            registerForm.classList.add('hide')

        }
        else {
            alert(`회원가입 실패 : ${_result.info}`)
        }

        console.log(_result)

    });




}