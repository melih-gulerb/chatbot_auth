export class AuthQueries {
    static RegisterUserQuery = `
            INSERT INTO dbo.Users (Id, Email, Password, CreatedAt, UpdatedAt)
            VALUES (@Id, @Email, @Password, GETDATE(), GETDATE())`;
    static AuthenticateUserQuery = `
            SELECT Id, Password
            FROM dbo.Users
            WHERE Email = @Email`;
}