cls
del .\dist\mvm.tf.exe
go build -ldflags="-X main.UseEmbed=false" -o dist/mvm.tf.exe ./src/server/...
.\dist\mvm.tf.exe
