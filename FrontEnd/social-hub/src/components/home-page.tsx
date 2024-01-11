
export const HomePage = () => {

    const onOpenLoginModel = () => {
        let modal: any =  document.getElementById('login-modal');
        modal.showModal()
      }


    return(
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row">
                <img src="http://localhost:8000/images/logo.png" className="max-w-sm rounded-lg shadow-2xl" />
                <div>
                <h1 className="text-5xl font-bold">Social-Hub</h1>
                <p className="py-6">Let's get social!</p>
                <button className="btn btn-primary" onClick={onOpenLoginModel}>Login</button>
                </div>
            </div>
        </div>
    )
}