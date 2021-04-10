# Watch_dir
Watch Directory and convert any xml in the specified directory and any of it's children to JSON and output it to another user specified directory. It will also remove json files when the corrosponding xml file is removed. On startup, this program will run through all of the existing xml files in the first directory, and output them to the output directory.

To run this, the command line takes one arguement and one optional arguement. The first arguement is to specify the directory in which xml files are being picked up from. The second arguement specifies which drectory to put the created json files into. If no directory is specified, it will drop the json files into the directory specified by the first arguement.

# Examples
node app.js foo/bar/
- In this example, the xml files will be picked up in the directory foo/bar/, converted to json, and dropped off in the directory foo/bar/
- If a file is created, changed, or deleted in the child directory foo/bar/foo/, it will be updated or deleted in the directory foo/bar/foo/

node app.js foo/bar/ bar/foo/
- In this example, the xml files will be picked up in the directory foo/bar/, converted to json, and dropped off in the directory bar/foo/
- If a file is created, changed, or deleted in the child directory foo/bar/foo/, it will be updated or deleted in the directory bar/foo/foo/

