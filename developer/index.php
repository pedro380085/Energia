<?php include_once("../includes/header.php"); ?>
<?php
//	$url = explode(".", $_SERVER["SERVER_NAME"]);
//	$position = array_search("negociopresente", $url);
//	
//	
//	if ($position) {
//		if ($url[$position-1] != "developer") {
//			header("Location: http://developer.negociopresente.com/");
//		}
//	}
?>
<?php
	if ($globalDev == 1) {
		$host = ($_SERVER['SERVER_ADDR'] == "::1") ? "localhost" : $_SERVER['SERVER_ADDR'];

		define("URL", "http://" . $host . ":8888/Energy/developer/api/");
	} else {
		$host = (strstr($_SERVER['REQUEST_URI'], "-dev") != FALSE) ? "pedrogoes.info/Energy" : "agarca.com.br";

		define("URL", "http://" . $host . "/developer/api/");
	}
?>
<!--

	SISTEMA PROPRIEDADE DO ESTÚDIO TRILHA (estudiotrilha.com.br)
	
	DEDICADO A MEMÓRIA DE FRANCISCO PEÇANHA MARTINS

-->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Garça Developer - Acessar seus dados nunca foi tão fácil!</title>
	
	<!--[if lt IE 9]>
	<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
	
	<link rel="stylesheet" href="../css/default.css" type="text/css" />
	<link rel="stylesheet" href="../css/jquery-ui-1.8.21.custom.min.css" type="text/css" />
	<link rel="stylesheet" href="../css/shCore.css" type="text/css" />
	<link rel="stylesheet" href="../css/shThemeDefault.css" type="text/css" />
	
	<?php if ($globalDev == 1) { ?>
	
	<script src="../js/jquery-1.8.3.min.js" type="text/javascript"></script>
	<script src="../js/jquery-ui-1.8.21.custom.min.js" type="text/javascript"></script>
	
	<?php } else { ?>
	
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script>!window.jQuery && document.write(unescape('%3Cscript src="../js/jquery-1.8.3.min.js"%3E%3C/script%3E'))</script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js"></script>
	<script>!window.jQuery.ui && document.write(unescape('%3Cscript src="../js/jquery-ui-1.8.21.custom.min.js"%3E%3C/script%3E'))</script>
	
	<?php } ?>
	
	<script src="../js/analytics.js" type="text/javascript"></script>
	<script src="../js/modules/functions.js" type="text/javascript"></script>
	<script src="../js/developer.js" type="text/javascript"></script>
	<script src="../js/shCore.js" type="text/javascript"></script>
	<script src="../js/shBrushJScript.js" type="text/javascript"></script>
	
	<link href="../favicon.ico" rel="icon" type="image/x-icon" />

</head>
<body>

	<div id="header"></div>
	
	<div id="content">
		
		<!--Content-->
		<div class="developerContent pageContent">
			
			<div class="titleContent">Desenvolvedor</div>
			
			<div class="boardContent">
				
				<div class="documentation">
					<div class="menuDocumentation">
						<ul>
							<li class="optionMenuDocumentationCategory optionMenuDocumentationSelected">Como usar</li>
							<li>Relatório</li>
						</ul>
					</div>
					<div class="contentDocumentation">

						<?php
							include_once("documentation/howTo.php");
							include_once("documentation/report.php");
						?>
						
						<div class="demoDocumentation">
							<div class="tokenWrapper">
								<div class="inert"><input type="text" class="token" placeholder="$tokenID"></div>
							</div>
							<div class="getWrapper">
								<div class="inert solid"><input type="text" class="getField" placeholder="GET"></div>
							</div>
							<div class="postWrapper">
								<div class="inert solid"><input type="text" class="postField" placeholder="POST"></div>
							</div>
							<pre placeholder="Nenhuma resposta até o momento! Verifique se seus parâmetros estão corretos." class="return"></pre>
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div id="wrapper">
		<div class="bar barBottom">
			<ul>
				<li>&reg;<a target="_blank" href="http://estudiotrilha.com.br">Estúdio Trilha 2013</a> &nbsp;&nbsp;&nbsp; Todos os direitos reservados</li>
			</ul>
		</div>
	</div>

</body>
</html>