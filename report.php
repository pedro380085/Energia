<?php
	include_once("includes/header.php");
?>

<?php include_once("includes/html/header.php") ?>
<body>
	<?php include_once("includes/html/bar.php") ?>

	<div id="content">
		<div class="reportContent pageContent">
			
			<div class="titleContent">Relatórios</div>
			
			<div class="boardContent" data-ajax="ajaxCarte">
				<div class="boardContentInnerWrapper">
					<div class="menuContent">

						<!-- ToolBox Import -->
						<div class="toolBoxOptions toolBoxOptionsInformation">
							<p class="inputHeader">Informações sobre a ferramenta</p>
							
							<p class="dropDetailedBox">Instruções</p>
							<div class="detailedBox">
								<p>Para adicionar um cardápio a partir de um arquivo Excel <b>2007</b>, crie as seguintes colunas dentro de sua planilha:</p>
								
								<ul class="rotatedList">
									<li>
										<span class="title">categoria</span>
										<span class="description">Nome de sua categoria</span>
									</li>
									<li>
										<span class="title">codigo</span>
										<span class="description">Código do seu item</span>
									</li>
									<li>
										<span class="title">nome</span>
										<span class="description">Título do seu item</span>
									</li>
									<li>
										<span class="title">descricao</span>
										<span class="description">Descrição sobre seu item</span>
									</li>
									<li>
										<span class="title">preco</span>
										<span class="description">Preço do seu item</span>
									</li>
								</ul>
								
								<p>Após isso, para cada linha na planilha, adicionaremos um novo item dentro do seu cardápio. Para agrupar os itens dentro de categorias, basta  manter a mesma categoria para vários itens.</p>
								
								<p>E pronto! Para ativar o novo cardápio, basta marcá-lo como <b>Cardápio Principal</b>.</p>
							</div>
							
						</div>

						<!-- Tool Triggers -->
						<div class="toolBox">
							<div class="toolBoxReservation">
								<div class="toolBoxLeft">
									<img src="images/64-Printer.png" alt="Imprimir" title="Imprimir" class="toolPrint"/>
								</div>
								
								<div class="toolBoxBreadcrumb"><p></p></div>
								
								<div class="toolBoxRight">
									<img src="images/64-Mickey.png" alt="Informações" title="Informações" class="toolInformation"/>
									<img src="images/64-Laptop.png" alt="Apresentação" title="Apresentação" class="toolFull"/>
								</div>
							</div>
						</div>

					</div>
					
					<div id="userBox"></div>
					<div class="snowflake"></div>
					
					<div class="pageContentBox">
						
						<div class="reportOptions">
							<div class="reportOption hour">
								<p>Hora</p>
								<select>
	                                <option value="0">0:00</option>
	                                <option value="1">1:00</option>
	                                <option value="2">2:00</option>
	                                <option value="3">3:00</option>
	                                <option value="4">4:00</option>
	                                <option value="5">5:00</option>
	                                <option value="6">6:00</option>
	                                <option value="7">7:00</option>
	                                <option value="8">8:00</option>
	                                <option value="9">9:00</option>
	                                <option value="10">10:00</option>
	                                <option value="11">11:00</option>
	                                <option value="12">12:00</option>
	                                <option value="13">13:00</option>
	                                <option value="14">14:00</option>
	                                <option value="15">15:00</option>
	                                <option value="16">16:00</option>
	                                <option value="17">17:00</option>
	                                <option value="18">18:00</option>
	                                <option value="19">19:00</option>
	                                <option value="20">20:00</option>
	                                <option value="21">21:00</option>
	                                <option value="22">22:00</option>
	                                <option value="23">23:00</option>
	                            </select>
							</div>
							
							<div class="reportOption weekDay">
								<p>Dia da semana</p>
								<select>
	                                <option value="0">Domingo</option>
	                                <option value="1">Segunda</option>
	                                <option value="2">Terça</option>
	                                <option value="3">Quarta</option>
	                                <option value="4">Quinta</option>
	                                <option value="5">Sexta</option>
	                                <option value="6">Sábado</option>
	                            </select>
							</div>

							<div class="reportOption month">
								<p>Mês</p>
								<select>
	                                <option value="1">Janeiro</option>
	                                <option value="2" selected>Fevereiro</option>
	                                <option value="3">Março</option>
	                                <option value="4">Abril</option>
	                                <option value="5">Maio</option>
	                                <option value="6">Junho</option>
	                                <option value="7">Julho</option>
	                                <option value="8">Agosto</option>
	                                <option value="9">Setembro</option>
	                                <option value="10">Outubro</option>
	                                <option value="11">Novembro</option>
	                                <option value="12">Dezembro</option>
	                            </select>
							</div>

						</div>
					</div>
										
					<div class="detailBox"></div>
				</div>
			</div>
		</div>
    </div>
    
    <?php include_once("includes/html/wrapper.php") ?>
</body>
</html>