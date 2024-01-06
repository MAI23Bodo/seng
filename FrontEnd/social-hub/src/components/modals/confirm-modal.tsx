
interface ConfirmModalProps {
    id: string;
    confirm: (confirmed: boolean) => void;
}

export default function ConfirmModal(props: ConfirmModalProps) {
    
    const handleClick = (input: boolean) => {
        let modal: any =  document.getElementById(`confirm-modal-${props.id}`);
        modal!.close()
        props.confirm(input)
    }

    return (
        <dialog id={`confirm-modal-${props.id}`} className="modal">
            <div className="modal-box">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Confirm</h3>
                <div className="mt-2">
                    Are you sure you want to delete this post?
                </div>
                <form method="post" className="mt-2">
                    <button className="btn  btn-primary mt-2" type="button" onClick={e => handleClick(true)}>Confirm</button>
                    <button className="btn  btn-neutral  mt-2 ml-2" type="button" onClick={e => handleClick(false)}>Cancel</button>
                </form>
            </div>
        </dialog>
    )
}