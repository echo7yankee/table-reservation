interface IBuildResponseSuccess {
    res: any;
    statusCode: number;
    data: any;
}

interface IBuildResponseError {
    res: any;
    statusCode: number;
    message: string;
}

export default class BuildResponse {
    buildSuccess = ({ res, statusCode, data }: IBuildResponseSuccess) => {
        return res.status(statusCode).json({
            success: true,
            data,
        });
    };

    buildError = ({ res, statusCode, message }: IBuildResponseError) => {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    };
}
