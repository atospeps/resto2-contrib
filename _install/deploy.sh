#!/bin/bash

usage="## RESTo administration deployment\n\n  Usage $0 -s <ADMIN_SOURCE> -t <ADMIN_TARGET> -b <BACKUPDIR>\n"
while getopts "s:t:b:h" options; do
    case $options in
        s ) SRCDIR=`echo $OPTARG`;;
        t ) TARGETDIR=`echo $OPTARG`;;
        b ) BACKUPDIR=`echo $OPTARG`;;
        h ) echo -e $usage;;
        \? ) echo -e $usage
            exit 1;;
        * ) echo -e $usage
            exit 1;;
    esac
done
if [ "$SRCDIR" = "" ]
then
    echo -e $usage
    exit 1
fi
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
		
		cp -r $TARGETDIR ${BACKUPDIR%%/}/Administration_$(date +"%Y-%m-%d")
		rc=$?
		if [[ $? != 0 ]]; then
			exit $rc
		fi			
		rm -r $TARGETDIR
		mkdir $TARGETDIR
    fi
else
	mkdir $TARGETDIR
fi

echo ' ==> Copy files to $TARGETDIR directory'
cp -Rf $SRCDIR/index.html $SRCDIR/app $SRCDIR/assets $TARGETDIR
echo ' ==> Successfully install resto administration to $TARGETDIR directory'
echo ' ==> Now, do not forget to check $TARGETDIR/app/components/app.constant.js configuration !'
