CREATE PROCEDURE FI_SP_DelTodosClienteBenef
    @IDCLIENTE BIGINT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM BENEFICIARIOS
    WHERE IDCLIENTE = @IDCLIENTE;
END;