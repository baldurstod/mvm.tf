$files = Get-ChildItem -Recurse "./population/*.pop"
foreach ($file in $files){
    #echo "$file.gz"
	7z a -tgzip "$file.gz" $file.FullName
}
