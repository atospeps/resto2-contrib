#!/bin/bash

# recuperation du repertoire du script, n'utiliser que la variable PRG_DIR qui represente le chemin absolu
PRG="$0"
EXEC_DIR=`dirname ${PRG}`
export PRG_DIR=`(cd ${EXEC_DIR} ; echo $PWD)`
#PRG_DIR correspond au chemin complet vers _install
SRCDIR="${PRG_DIR}/.."

USER="exppeps"
GROUP="peps"

usage="## RESTo administration deployment\n\n  Usage $0 -t <ADMIN_TARGET> -u <unix_user> -g <unix group> -b <BACKUPDIR>\n"
while getopts "t:u:g:b:h" options; do
    case $options in
        t ) TARGETDIR=`echo $OPTARG`;;
        u ) USER=`echo $OPTARG`;;
        g ) GROUP=`echo $OPTARG`;;
        b ) BACKUPDIR=`echo $OPTARG`;;
        h ) echo -e $usage;;
        \? ) echo -e $usage
            exit 1;;
        * ) echo -e $usage
            exit 1;;
    esac
done
if [ "$TARGETDIR" = "" ]
then
    echo -e $usage
    exit 1
fi

if [ -d "$TARGETDIR" ]; then
    if [ "$(ls $TARGETDIR)" ]; then
        # backup
    	if [ ! -d "$BACKUPDIR" ]; then
    		mkdir $BACKUPDIR
			if [[ $? != 0 ]]; then
				exit $rc
			fi	
		fi
	    BASE=`basename $TARGETDIR`
	    DIR=`dirname $TARGETDIR`
	    echo "Creating a backup in $BACKUPDIR"
	    tar czf ${BACKUPDIR%%/}/admin-$(date +"%Y-%m-%d").tgz -C $DIR $BASE
		rc=$?
		if [[ $? != 0 ]]; then
			exit $rc
		fi			
		rm -rf $TARGETDIR
    fi
fi
mkdir $TARGETDIR

echo ' ==> Copy files to $TARGETDIR directory'
cp -Rf $SRCDIR/index.html $SRCDIR/favicon.ico $SRCDIR/app $SRCDIR/assets $TARGETDIR


# deploiement du fichier version s'il existe
if [ -f $SRCDIR/version.txt ]; then
    cp $SRCDIR/version.txt $TARGETDIR
fi


echo " ==> Applying unix user's rights."
chown -R $USER:$GROUP $TARGETDIR
chmod -R 750 $TARGETDIR

echo ' ==> Successfully install resto administration to $TARGETDIR directory'
echo ' ==> Now, do not forget to check $TARGETDIR/app/components/app.constant.js configuration !'
