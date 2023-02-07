let form = document.getElementById('form')

let handleSubmit = async(e) => {
    e.preventDefault()
    let meetName = e.target.meetName.value.toUpperCase()
    let userName = e.target.name.value
    let response = await fetch(`/get_token/?channel=${meetName}`)
    let data = await response.json()
    let UserID = data.uid
    let token = data.token
    sessionStorage.setItem('UserID', UserID)
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('meetName', meetName)
    sessionStorage.setItem('userName', userName)
    window.open('/lets_meet/', '_self')
}

form.addEventListener('submit', handleSubmit)