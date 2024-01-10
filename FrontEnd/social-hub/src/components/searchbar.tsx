import { Dispatch, SetStateAction } from "react"

export interface SearchBarProps {
    setSearch: Dispatch<SetStateAction<string | null>>
    search: string | null
}

export const SearchBar = (props: SearchBarProps) => {


    const OnSearch = () => {
        props.setSearch(props.search)
    }

    return (
        <div className="join">
            <div>
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input w-24 md:w-auto" value={props.search ?? ''} onChange={(e) => {props.setSearch(e.target.value)}}/>
                </div>
            </div>

        </div>
    )
}


