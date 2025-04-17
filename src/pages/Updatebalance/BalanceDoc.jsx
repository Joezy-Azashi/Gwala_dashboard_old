import React, { useEffect } from 'react'
import { File, FirstSection, SecondSection } from '../../components/E-documents/EdocsUpload/style';
import { useLocale } from '../../locales';
import { useDropzone } from 'react-dropzone';

const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
const documentTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];

const Basic = ({ file, setFile, accept }) => {
    const { formatMessage } = useLocale();
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: accept,
    });
    useEffect(() => {
        if (acceptedFiles.length > 0) setFile(acceptedFiles);
    }, [acceptedFiles]);
    const files = file?.map((file, key) => (
        <File key={key} selected>
            <div className="remove" onClick={() => setFile([])}>
                X
            </div>
            <div className="type">
                {imageTypes.includes(file?.type) ? (
                    <img src="/icons/Edocs/image.svg" />
                ) : documentTypes.includes(file?.type) ? (
                    <img src="/icons/Edocs/document.svg" />
                ) : (
                    <img src="/icons/Edocs/pdf.svg" />
                )}
            </div>
            <h5>{file?.path || file?.file_path}</h5>
            <p>
                Size:
                {(
                    (parseFloat(file?.size) || parseFloat(file?.file_size)) /
                    (1024 * 1024)
                ).toFixed(2)}
                MB
            </p>
        </File>
    ));

    return (
        <FirstSection>
            {files}
            {file?.length === 0 && (
                <File
                    {...getRootProps({
                        className: "dropzone",
                    })}
                >
                    <input {...getInputProps()} />
                    <img src="/icons/Edocs/upload.svg" />
                    <h5>{formatMessage({ id: "edoc.uploaddocs" })}</h5>
                    <p>{formatMessage({ id: "edoc.maxsize" })}: 20Mo</p>
                </File>
            )}
        </FirstSection>
    );
};

function BalanceDoc({
    children,
    setFile,
    file,
    title,
    description,
    accept,
}) {
    return (
        <div>
            <div style={{ marginBottom: "13px" }}>
                <span style={{ fontWeight: 400 }}>{title}</span>
                <p style={{ fontSize: "13px" }}>{description}</p>
            </div>
            <Basic setFile={setFile} file={file} accept={accept} />
            {/* <hr style={{ height: "2.5px", background: "#000" }} /> */}
            <SecondSection>{children}</SecondSection>
        </div>
    )
}

export default BalanceDoc