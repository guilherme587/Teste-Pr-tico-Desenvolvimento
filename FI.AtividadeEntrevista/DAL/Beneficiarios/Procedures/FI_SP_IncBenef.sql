CREATE PROC FI_SP_IncBenef
    @Nome VARCHAR(50),
    @CPF VARCHAR(14),
    @IDCLIENTE BIGINT
AS
BEGIN
    BEGIN TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM BENEFICIARIOS WHERE CPF = @CPF AND IDCLIENTE = @IDCLIENTE)
    BEGIN
        INSERT INTO BENEFICIARIOS (CPF, Nome, IDCLIENTE)
        VALUES (@CPF, @Nome, @IDCLIENTE);

        COMMIT TRANSACTION;

        SELECT 'Beneficiário adicionado com sucesso.' AS Mensagem;
    END
    ELSE
    BEGIN
        ROLLBACK TRANSACTION;

        SELECT 'Erro: Beneficiário já existe para o cliente especificado.' AS Mensagem;
    END
END;
