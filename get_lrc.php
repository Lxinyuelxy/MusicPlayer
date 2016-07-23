<?php
header('content="text/html;charset=utf-8"');
$lrc_file_name = $_GET['name'];
$method = $_GET['method'];

if($method == "get_lyric_data"){                //获取指定歌词名的歌词内容
    if($lrc_file_name == "")
    {
        echo "{";
        echo "\"state\":\"wrong\",";
        echo "\"message\":\"no lrc filename\"";
        echo "}";
    } else{
        $path="mp3/".$lrc_file_name;
        $path=iconv("utf-8", "gb2312", $path);
        //这个函数的作用是把$path从“uft8”转换成"bg2312"编码，然后返回转换后的字符串
        //如果是在window下服务器运行，则需要把$path从utf-8转换成bg2312编码
        //因为window默认字符集是bg2312，而我们网页上用的是utf-8，要不然php将找不到文件
        if( file_exists($path) )
        {
            $file = fopen($path, "r");
            $lrc_data="";
            while (!(feof($file)))
            {
                $text=fgets($file);
                //$text=preg_replace("/\n/","", $text);
                $text=preg_replace("/\r\n/","", $text);
                //preg_replace()是正则替换，/\n/是正则表达式，函数作用是用第二个参数去
                //替换正则匹配的结果，在这里的作用就是把$text的换行替换成“”,也就是空字符
                //因为使用json传送歌词，而json格式不允许包含换行符，不然会报错
                //注意：window下和Linux下的换行是不同的，window下是\r\n，而Linux是\n，
                //所以这里要注意不同的环境要相应的改动一下
                $lrc_data=$lrc_data.$text.",";
            }
            fclose($file);
            echo "{";
            echo "\"state\":\"success\",";
            echo "\"message\":\"all have done\",";
            echo "\"lrc\":\"".$lrc_data."\"";
            echo "}";
        }else{
            echo "{";
            echo "\"state\":\"success\",";
            echo "\"message\":\"can not open file\",";
            echo "\"lrc\":\"          暂时没有歌词 稍后我会添加 sorry\"";
            echo "}";
        }
    }
}else if($method == "get_music_list"){        //获取所有歌曲列表
    $dir="./mp3";
    //你存放MP3和歌词的目录
    $handle=opendir($dir);
    //PHP遍历文件夹下所有文件 
    $list = array();
    //定义用于存储文件名的数组
    while (false !== ($file = readdir($handle)))
    {
        if ($file!="." && $file!=".." && (substr($file,-3)=="mp3" || substr($file,-3)=="ogg") ){
            //这里我们只要mp3和ogg文件，并且过滤掉.和..，它们分别表示下一级目录和上一级目录
            $list[] = $file;
            //将文件名保存到list数组
        }
    }
    closedir($handle);
    echo "{";
    echo "\"state\":\"success\",";
    echo "\"music_list\":[";
    $list_length = count($list);
    for ($i=0; $i < $list_length; $i++) { 
        echo "\"".iconv("gb2312", "utf-8", $list[$i])."\"";
        //echo "\"".$list[$i]."\"";
        //注意，如果系统默认字符集不是utf-8，需要把$list[$i]转换成utf-8编码
        //比如你是在window下服务器运行的，就要加上这句了，不然会乱码
        if($i != ($list_length-1) )
            echo ",";
    }
    echo "]";
    echo "}";
}else{                                                //给的method参数不符
    echo "{";
    echo "\"state\":\"wrong\",";
    echo "\"message\":\"no such method\"";
    echo "}";
}

?>