
; ===========================================================
; Dal.Repositories.UsuariosRepository
; ===========================================================
#Dal.Repositories.UsuariosRepository.OrderBy%Id ASC
#Dal.Repositories.UsuariosRepository.Delete%DELETE FROM [Usuario] WHERE Id=@Id
#Dal.Repositories.UsuariosRepository.Select%SELECT Id, Nif, Nombre, Descripcion, FechaDeAlta FROM [Usuario]
#Dal.Repositories.UsuariosRepository.Insert%INSERT INTO [Usuario] (Nif, Nombre, Descripcion, FechaDeAlta) VALUES(@Nif, @Nombre, @Descripcion, GETDATE()); SELECT CAST(SCOPE_IDENTITY() AS BIGINT);
#Dal.Repositories.UsuariosRepository.Update%UPDATE [Usuario] SET Nif = @Nif, Nombre = @Nombre, Descripcion = @Descripcion WHERE Id=@Id

; ===========================================================
; Dal.Repositories.Sqlite.UsuariosRepository
; ===========================================================
#Dal.Repositories.Sqlite.UsuariosRepository.OrderBy%Id ASC
#Dal.Repositories.Sqlite.UsuariosRepository.Delete%DELETE FROM [Usuario] WHERE Id=@Id
#Dal.Repositories.Sqlite.UsuariosRepository.Select%SELECT id, name, value FROM [Usuario]
#Dal.Repositories.Sqlite.UsuariosRepository.Insert%INSERT INTO [Usuario] (name, value) VALUES( @name, @value); SELECT last_insert_rowid();
#Dal.Repositories.Sqlite.UsuariosRepository.Update%UPDATE [Usuario] SET name = @name, value = @value WHERE Id=@Id

; =======================================================================================
; Dal.Repositories.table_name
; =======================================================================================
#Dal.Repositories.table_name.Count%SELECT COUNT(*) FROM T_SEG_USUARIOS WHERE ID = '{0}'
#Dal.Repositories.table_name.SelectAll%SELECT ID, CD_USUARIO, DS_USUARIO, DS_EMAIL, CD_USUARIO_MOD, FE_ALTA, FE_MODIFICACION FROM [T_SEG_USUARIOS]
>>>
Dal.Repositories.table_name.SelectAllSmall
SELECT ID,
	   CD_USUARIO,
	   DS_USUARIO,
	   DS_EMAIL,
	   CD_USUARIO_MOD,
	   FE_ALTA,
	   FE_MODIFICACION
FROM [T_SEG_USUARIOS]

#Dal.Repositories.table_name.CountNew%SELECT COUNT(*) FROM T_SEG_USUARIOS WHERE ID = '{0}'
>>>
Dal.Repositories.table_name.CountNew2
SELECT COUNT(*)
FROM T_SEG_USUARIOS
WHERE ID = '{0}'