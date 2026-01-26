export default function Fish({ src, name }) {
    return (
        <div className="">
            <img src={src} alt={name} />
            <div className="information">
                <h3>{name}</h3>
                <span className="tooltip">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
            </div>
        </div>
    );
}