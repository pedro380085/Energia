<!-- COMO USAR -->
<div class="documentationBox documentationBoxSelected">
	<h2>Uso</h2>

	<p>Para utilizar a API do <b>Garça</b>, basta consultar nossa documentação disponível à esquerda. Abaixo temos um exemplo que será utilizado posteriormente para explicar o envio de requisições.</p>
	
	<h3>URL oficial</h3>
		<pre class="url oficialURL"><?php echo URL ?></pre>
	
	<h3>Exemplo de documentação</h3>
		<p>Para testar a função, basta clicar no ícone <img src="../images/64-Chemical.png" class="tryItOut" alt="Try it out!"> que uma requisição será efetuada para demonstrar o uso da chamada.</p>
		<div class="documentationFunctionBox">
			<p class="documentFunctionName">
				<span>person.signIn(<b>email</b>, <b>password</b>)</span>
				<img src="../images/64-Chemical.png" alt="Try it out!" class="tryItOut" data-get="method=person.signIn&email=Email&password=Senha">
			</p>

			<p class="documentFunctionDescription">Inicia a sessão de uma pessoa e retorna o <b>tokenID</b> (60 caracteres) caso a operação tenha sido bem sucedida.</p>

			<div class="documentationFunctionParametersBox">
				<p><b>email</b><sub>GET</sub> : email do membro</p>
				<p><b>password</b><sub>GET</sub> : senha do membro</p>
			</div>
		</div>
	
		<pre class="url"><?php echo URL ?>?method=person.signIn&email=Email&password=Senha</pre>
	
	<h3>Explicação</h3>
		<p>Existem três seções demarcadas: <b>cabeçalho, retorno e parâmetros</b>, cada qual sendo explicada separadamente:</p>
		<ul>
			<li>O <b>cabeçalho</b> (person.signIn) apresenta a chamada, composto de um <u>namespace</u> (person) e seu <u>método</u> (signIn). A chamada deve ser enviada ao servidor através do método subscrito para que seja corretamente identificada.</li>
			<li>O <b>retorno</b> explica quais dados serão retornados, podendo o usuário sempre pode fazer uma requisição de teste para ver quais serão os dados de retorno.</li>
			<li>Os <b>parâmetros</b> (email e password) mostram seu significado e por qual método devem ser enviados, variando sempre entre GET e POST.</li>
		</ul>
		
	<h3>Notas</h3>
		<p>A API do <b>Garça</b> utiliza um RPC-REST híbrido, utilizando o POST carregado como forma de enviar dados que necessitem ser escritos.</p>
		<p>Os dados retornados podem vir em diferentes formatos, bastando informar o parâmetro <b>format</b><sub>GET</sub> com a opção adequada:</p>
		<ul>
			<li><i>json</i> : estrutura composta pela quantidade de elementos <u>count</u> e os dados <u>data</u> </li>
			<li><i>html</i> : estrutura do documento, sem a folha de estilos </li>
		</ul>
	
</div>