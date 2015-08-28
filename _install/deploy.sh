#!/bin/bash

# recuperation du repertoire du script, n'utiliser que la variable PRG_DIR qui represente le chemin absolu
PRG="$0"
EXEC_DIR=`dirname ${PRG}`
export PRG_DIR=`(cd ${EXEC_DIR} ; echo $PWD)`
#PRG_DIR correspond au chemin complet vers _install
SRCDIR="${PRG_DIR}/.."

usage="## RESTo administration deployment\n\n  Usage $0 -t <ADMIN_TARGET> -b <BACKUPDIR>\n"
while getopts "t:b:h" options; do
    case $options in
        t ) TARGETDIR=`echo $OPTARG`;;
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
    	if [ ! -d "$BACKUPDIR" ]; then
    		mkdir $BACKUPDIR
			if [[ $? != 0 ]]; then
				exit $rc
			fi	
		fi
		
		tar czf ${BACKUPDIR%%/}/Administration_$(date +"%Y-%m-%d").tgz $TARGETDIR 
		rc=$?
		if [[ $? != 0 ]]; then
			exit $rc
		fi			
		rm -r $TARGETDIR
    fi
fi
mkdir $TARGETDIR

echo ' ==> Copy files to $TARGETDIR directory'
cp -Rf $SRCDIR/index.html $SRCDIR/favicon.ico $SRCDIR/app $SRCDIR/assets $TARGETDIR
echo ' ==> Successfully install resto administration to $TARGETDIR directory'
echo ' ==> Now, do not forget to check $TARGETDIR/app/components/app.constant.js configuration !'
