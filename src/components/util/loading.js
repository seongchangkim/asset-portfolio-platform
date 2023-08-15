const Loading = ({content}) => {
    return (
        <div className="flex justify-center items-center w-full h-screen">
            <h1 className="text-3xl font-mono">{content}</h1>
        </div>
    );
};

export default Loading;